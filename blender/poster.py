"""
Render parado da maquete (DESIGN.md, seção 5, item 6), com o que só o pôster tem: a suíte do Simulador em
marca-texto, como o cômodo em foco (o piso e um volume translúcido até o corte das paredes), e o nome de
cada seção acima do cômodo. Os dois existem só durante o render:
no site o realce acende no cômodo sob o mouse e os nomes vêm do SVG, então nada disso vai para o bake nem
para o .glb.

Rode com a maquete montada (maquete.py e arte.py), pelo Python Console:
  exec(open(r"C:\\Users\\joaov\\Portfolio\\blender\\poster.py", encoding="utf-8").read(),
       {"__name__": "__main__", "__file__": r"C:\\Users\\joaov\\Portfolio\\blender\\poster.py"})
Saída: public/maquete/poster.webp
"""

import importlib
import json
import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import maquete  # noqa: E402  (só as contas da planta; nada é montado)
importlib.reload(maquete)

FOCO = "simulador"            # o cômodo aceso em marca-texto
MARCA_TEXTO = "#F5D547"
TINTA = "#1E2A22"
FONTE = r"C:\Windows\Fonts\segoeuib.ttf"  # Segoe UI Bold, até a Bricolage Grotesque virar .ttf aqui
ALTURA_ROTULO = 125           # cm: logo acima do corte das paredes (1,20 m), para nada tapar os nomes
TAMANHO_MAXIMO = 40           # cm de altura de letra


def _cor_base(material):
    bsdf = next(n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    return bsdf.inputs["Base Color"]


def _rotulos(planta, colecao):
    """Nome de cada seção deitado sobre o cômodo, lendo da câmera (do lado da varanda)."""
    cx, cy, _ = maquete.centro(planta)
    fonte = bpy.data.fonts.load(FONTE, check_existing=True) if os.path.exists(FONTE) else None
    tinta = maquete._material(bpy, "Rotulo", TINTA)
    for c in planta["comodos"]:
        if not c["nome"]:
            continue
        # cabe na largura do cômodo: cada letra ocupa uns 55% da altura
        tamanho = min(TAMANHO_MAXIMO, 0.85 * c["largura"] / (0.55 * len(c["nome"])), 0.8 * c["profundidade"])
        texto = bpy.data.curves.new(f"Rotulo_{c['id']}", "FONT")
        texto.body = c["nome"]
        texto.align_x, texto.align_y = "CENTER", "CENTER"
        texto.size = tamanho / 100
        if fonte:
            texto.font = fonte
        texto.materials.append(tinta)
        ob = bpy.data.objects.new(f"Rotulo_{c['id']}", texto)
        ob.location = ((c["x"] + c["largura"] / 2 - cx) / 100, -(c["y"] + c["profundidade"] / 2 - cy) / 100,
                       ALTURA_ROTULO / 100)
        ob.rotation_euler[2] = math.pi  # a câmera olha de +X+Y: o texto gira para ler de frente para ela
        colecao.objects.link(ob)


def _volume_foco(planta, colecao):
    """O cômodo em foco como um volume translúcido em marca-texto, do piso ao corte das paredes."""
    cx, cy, _ = maquete.centro(planta)
    c = next(c for c in planta["comodos"] if c["id"] == FOCO)
    m = planta["espessuraParede"] / 2
    vs, fs = maquete.caixa((c["x"] + m - cx) / 100, (c["x"] + c["largura"] - m - cx) / 100,
                           -(c["y"] + c["profundidade"] - m - cy) / 100, -(c["y"] + m - cy) / 100,
                           maquete.ALTURA_PISO / 100, maquete.ALTURA_CORTE / 100)
    malha = bpy.data.meshes.new("Foco")
    malha.from_pydata(vs, [], fs)
    material = bpy.data.materials.get("Marca-texto") or bpy.data.materials.new("Marca-texto")
    if hasattr(material, "use_nodes") and not material.use_nodes:
        material.use_nodes = True
    nos = material.node_tree.nodes
    nos.clear()
    bsdf = nos.new("ShaderNodeBsdfPrincipled")
    cor = (*maquete._linear(MARCA_TEXTO), 1.0)
    bsdf.inputs["Base Color"].default_value = cor
    bsdf.inputs["Alpha"].default_value = 0.25
    bsdf.inputs["Emission Color"].default_value = cor
    bsdf.inputs["Emission Strength"].default_value = 0.4
    material.node_tree.links.new(bsdf.outputs["BSDF"], nos.new("ShaderNodeOutputMaterial").inputs["Surface"])
    malha.materials.append(material)
    colecao.objects.link(bpy.data.objects.new("Foco", malha))


def renderizar():
    with open(maquete.caminho_planta(), encoding="utf-8") as f:
        planta = json.load(f)
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pasta = os.path.join(raiz, "public", "maquete")
    os.makedirs(pasta, exist_ok=True)
    cena = bpy.context.scene

    foco = _cor_base(bpy.data.materials[f"Piso_{FOCO}"])
    cor_original = tuple(foco.default_value)
    colecao = bpy.data.collections.new("Rótulos (pôster)")
    cena.collection.children.link(colecao)
    try:
        foco.default_value = (*maquete._linear(MARCA_TEXTO), 1.0)
        _rotulos(planta, colecao)
        _volume_foco(planta, colecao)
        cena.render.image_settings.file_format = "WEBP"
        cena.render.image_settings.quality = 82
        cena.render.filepath = os.path.join(pasta, "poster.webp")
        bpy.ops.render.render(write_still=True)
    finally:
        foco.default_value = cor_original
        for ob in list(colecao.objects):
            dados, malha = ob.data, ob.type == "MESH"  # lidos antes: depois de removido o objeto não existe mais
            bpy.data.objects.remove(ob, do_unlink=True)
            (bpy.data.meshes if malha else bpy.data.curves).remove(dados)
        bpy.data.collections.remove(colecao)
    print(f"Pôster em {cena.render.filepath}")


if __name__ == "__main__":
    renderizar()
