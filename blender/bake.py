"""
Passo 3 do plano (DESIGN.md, seção 5): assa a luz da maquete em lightmaps e exporta o modelo do site.
Rode com a maquete montada, depois do maquete.py e do arte.py. Demora alguns minutos e o Blender fica parado.

Saída em public/maquete/:
  maquete.glb          geometria com Draco, cores dos materiais, UV 0 (texturas) e UV 1 "Luz" (lightmap)
  luz-<grupo>.webp     só a luz de cada grupo, normalizada e em sRGB
  luz.json             para cada grupo: arquivo, intensidade (lightMapIntensity) e objetos que usam a lightmap
  poster.webp          o render parado da câmera do estande (pôster, fallback e imagem de compartilhamento)

No site: MeshBasicMaterial com a cor do material, lightMap = luz do grupo (colorSpace sRGB, channel 1)
e lightMapIntensity = intensidade do luz.json.
"""

import json
import math
import os

import bpy
import numpy as np

# Grupos de lightmap, como pede o DESIGN.md: paredes e móveis num atlas, pisos noutro, placa noutro.
GRUPOS = {
    "paredes-moveis": 2048,
    "pisos": 1024,
    "placa": 512,
}
AMOSTRAS_BAKE = 256
ORCAMENTO = {"glb": 1_000_000, "texturas": 1_500_000, "triangulos": 150_000}


def grupo_de(ob):
    if ob.type != "MESH" or ob.name.startswith("Vidro_"):
        return None  # vidro vai no .glb, mas sem lightmap
    if ob.name.startswith("Piso_"):
        return "pisos"
    if ob.name in ("Laje", "Base"):
        return "placa"
    colecoes = {c.name for c in ob.users_collection}
    if colecoes & {"Maquete (gerada)", "Móveis (gerados)"}:
        return "paredes-moveis"
    return None


def pasta_saida():
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pasta = os.path.join(raiz, "public", "maquete")
    os.makedirs(pasta, exist_ok=True)
    return pasta


def normalizar(pixels, percentil=99.9):
    """Luz assada (linear, pode passar de 1) → valores sRGB de 0 a 1 e o fator para o site desfazer a escala.
    O percentil ignora pixels estourados isolados."""
    rgb = pixels.reshape(-1, 4)[:, :3]
    cobertos = rgb[rgb.max(axis=1) > 0]  # o fundo do atlas, fora das ilhas de UV, fica preto
    fator = float(np.percentile(cobertos, percentil)) if cobertos.size else 1.0
    fator = fator if fator > 0 else 1.0
    linear = np.clip(rgb / fator, 0.0, 1.0)
    srgb = np.where(linear <= 0.0031308, linear * 12.92, 1.055 * np.power(linear, 1 / 2.4) - 0.055)
    return np.column_stack([srgb, np.ones(len(srgb))]).astype(np.float32).ravel(), fator


def _selecionar(objetos):
    for ob in bpy.context.view_layer.objects:
        ob.select_set(False)
    for ob in objetos:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objetos[0]


def desdobrar(objetos):
    """UV 0 fica como está (as texturas do piso usam); a UV 1 "Luz" recebe um atlas único do grupo."""
    for ob in objetos:
        uvs = ob.data.uv_layers
        if not uvs:
            uvs.new(name="UVMap")
        luz = uvs.get("Luz") or uvs.new(name="Luz")
        uvs.active = luz
    _selecionar(objetos)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.02)
    bpy.ops.uv.pack_islands(rotate=True, margin=0.004)
    bpy.ops.object.mode_set(mode="OBJECT")


def assar(grupo, objetos, tamanho, pasta):
    imagem = bpy.data.images.new(f"Luz_{grupo}", tamanho, tamanho, alpha=True, float_buffer=True)
    nos_temporarios = []
    for m in {s.material for ob in objetos for s in ob.material_slots if s.material}:
        no = m.node_tree.nodes.new("ShaderNodeTexImage")
        no.image = imagem
        m.node_tree.nodes.active = no
        nos_temporarios.append((m, no))
    _selecionar(objetos)
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={"DIRECT", "INDIRECT"}, margin=8, use_clear=True,
                        target="IMAGE_TEXTURES")
    for m, no in nos_temporarios:
        m.node_tree.nodes.remove(no)

    pixels = np.empty(tamanho * tamanho * 4, dtype=np.float32)
    imagem.pixels.foreach_get(pixels)
    srgb, fator = normalizar(pixels)
    saida = bpy.data.images.new(f"Luz_{grupo}_srgb", tamanho, tamanho, alpha=False)
    saida.pixels.foreach_set(srgb)
    arquivo = f"luz-{grupo}.webp"
    saida.filepath_raw = os.path.join(pasta, arquivo)
    saida.file_format = "WEBP"
    saida.save()
    bpy.data.images.remove(imagem)
    bpy.data.images.remove(saida)
    return {"arquivo": arquivo, "intensidade": round(fator, 4), "objetos": sorted(ob.name for ob in objetos)}


def exportar(pasta):
    objetos = [ob for ob in bpy.context.view_layer.objects if ob.type == "MESH"
               and ({c.name for c in ob.users_collection} & {"Maquete (gerada)", "Móveis (gerados)"})]
    _selecionar(objetos)
    caminho = os.path.join(pasta, "maquete.glb")
    bpy.ops.export_scene.gltf(filepath=caminho, export_format="GLB", use_selection=True, export_apply=True,
                              export_texcoords=True, export_normals=False, export_materials="EXPORT",
                              export_extras=True, export_draco_mesh_compression_enable=True,
                              export_draco_mesh_compression_level=6)
    dg = bpy.context.evaluated_depsgraph_get()
    triangulos = 0
    for ob in objetos:
        avaliado = ob.evaluated_get(dg)
        malha = avaliado.to_mesh()
        malha.calc_loop_triangles()
        triangulos += len(malha.loop_triangles)
        avaliado.to_mesh_clear()
    return caminho, triangulos


def poster(pasta):
    cena = bpy.context.scene
    ajustes = cena.render.image_settings
    ajustes.file_format = "WEBP"
    ajustes.quality = 82
    cena.render.filepath = os.path.join(pasta, "poster.webp")
    bpy.ops.render.render(write_still=True)


def construir():
    cena = bpy.context.scene
    cena.render.engine = "CYCLES"
    amostras = cena.cycles.samples
    cena.cycles.samples = AMOSTRAS_BAKE
    pasta = pasta_saida()
    luz = {}
    for grupo, tamanho in GRUPOS.items():
        objetos = [ob for ob in bpy.context.view_layer.objects if grupo_de(ob) == grupo]
        print(f"Bake de '{grupo}': {len(objetos)} objetos, {tamanho}px...")
        desdobrar(objetos)
        luz[grupo] = assar(grupo, objetos, tamanho, pasta)
    cena.cycles.samples = amostras
    with open(os.path.join(pasta, "luz.json"), "w", encoding="utf-8") as f:
        json.dump(luz, f, ensure_ascii=False, indent=2)
    caminho, triangulos = exportar(pasta)
    poster(pasta)

    texturas = sum(os.path.getsize(os.path.join(pasta, g["arquivo"])) for g in luz.values())
    medidas = {"glb": os.path.getsize(caminho), "texturas": texturas, "triangulos": triangulos}
    print("\nOrçamento (DESIGN.md, seção 5):")
    for chave, valor in medidas.items():
        print(f"  {chave}: {valor:,} de {ORCAMENTO[chave]:,} -> {'OK' if valor <= ORCAMENTO[chave] else 'ACIMA'}")
    print(f"Arquivos em {pasta}")


if __name__ == "__main__":
    construir()
