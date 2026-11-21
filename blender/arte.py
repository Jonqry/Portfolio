"""
Etapa de arte automática da maquete, na direção "maquete premium" do DESIGN.md: branco fosco, madeira de maquete,
acrílico e um único acento em marca-texto. Rode depois do maquete.py.

Como usar (Blender 5.3):
  Na aba Scripting, abra este arquivo e clique em Run Script, logo depois de rodar o maquete.py.
  Pelo terminal: blender blender/maquete.blend --python blender/maquete.py --python blender/arte.py

Diferente do maquete.py, este script sobrescreve os materiais que cria. Para mudar uma cor, mude aqui e rode de
novo, em vez de ajustar no Blender.
"""

import importlib
import json
import math
import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import maquete  # noqa: E402  (só o caminho da planta; nada é montado)
importlib.reload(maquete)

MOVEL = "#EEEBE4"          # branco fosco de maquete
TECIDO = "#E4DED3"         # camas e almofadas, um pouco mais quentes que os móveis
CORTE = "#2B3238"          # topo do corte das paredes, como o preenchimento da parede numa planta impressa
PAVIMENTO = "#F1EFEA"      # pisos dos vizinhos e do corredor: brancos, para a unidade se destacar
MADEIRA = ("#D8C19C", "#CDB48C", "#B39A74")  # réguas claras, réguas escuras e a junta
PEDRA = ("#DEDCD6", "#D6D4CE", "#BFBCB5")    # placas e junta
RIPA = "#C9AE84"           # o ripado do jantar, na madeira de maquete
FRESTA = "#8A6B45"
RIPAS_POR_METRO = 25       # ripa de 4 cm
# Materiais do Furniture Kit da Kenney que não viram o branco fosco: estofados e tapetes vão para o tecido, e a
# tela da TV, o tampo do fogão e o metal escuro para o grafite do corte
KIT = {"carpet": "Tecido", "carpetWhite": "Tecido", "carpetBlue": "Tecido", "carpetDarker": "Tecido",
       "metalDark": "Corte", "glass": "Corte"}
PISO_POR_TIPO = {"taco": "madeira", "porcelanato": "madeira", "ceramica": "pedra", "varanda": "pedra",
                 "laje": "branco"}


def _linear(hexa):
    return (*maquete._linear(hexa), 1.0)


def _material(nome, hexa, rugosidade=0.8):
    """Cria ou refaz o material do zero e devolve a árvore de nós e o Principled BSDF."""
    m = bpy.data.materials.get(nome) or bpy.data.materials.new(nome)
    if hasattr(m, "use_nodes") and not m.use_nodes:
        m.use_nodes = True
    nos = m.node_tree.nodes
    nos.clear()
    saida = nos.new("ShaderNodeOutputMaterial")
    bsdf = nos.new("ShaderNodeBsdfPrincipled")
    m.node_tree.links.new(bsdf.outputs["BSDF"], saida.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = _linear(hexa)
    bsdf.inputs["Roughness"].default_value = rugosidade
    m.diffuse_color = _linear(hexa)  # é a cor que vai para o .glb quando a cor base é desenhada por nós
    return m, m.node_tree, bsdf


def _aplicar(material, nomes):
    """Troca o material dos objetos com esses nomes (ou começando com eles, para pegar os .001, .002).
    As peças do kit ficam de fora: elas têm vários materiais, trocados um a um em kit()."""
    objetos = [ob for ob in bpy.data.objects if ob.type == "MESH" and ob.name.startswith(tuple(nomes))
               and not ob.get("kit")]
    for ob in objetos:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    return len(objetos)


def _placas(nome, cores, largura, altura, deslocamento, rugosidade):
    """Piso em réguas ou placas desenhadas pelo material, com a junta em leve relevo. Medidas em metros."""
    clara, escura, junta = cores
    m, arvore, bsdf = _material(nome, clara, rugosidade)
    nos, ligar = arvore.nodes, arvore.links.new
    coord = nos.new("ShaderNodeTexCoord")
    tijolo = nos.new("ShaderNodeTexBrick")
    tijolo.offset = deslocamento
    for entrada, valor in (("Color1", _linear(clara)), ("Color2", _linear(escura)), ("Mortar", _linear(junta)),
                           ("Scale", 1.0), ("Mortar Size", 0.003), ("Brick Width", largura), ("Row Height", altura)):
        tijolo.inputs[entrada].default_value = valor
    ligar(coord.outputs["Object"], tijolo.inputs["Vector"])
    ligar(tijolo.outputs["Color"], bsdf.inputs["Base Color"])
    relevo = nos.new("ShaderNodeBump")
    relevo.inputs["Strength"].default_value = 0.15
    relevo.invert = True  # a junta (Fac = 1) fica abaixo da placa
    ligar(tijolo.outputs["Fac"], relevo.inputs["Height"])
    ligar(relevo.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def pisos():
    with open(maquete.caminho_planta(), encoding="utf-8") as f:
        planta = json.load(f)
    materiais = {"madeira": _placas("Piso_madeira", MADEIRA, 0.9, 0.15, 0.5, 0.55),
                 "pedra": _placas("Piso_pedra", PEDRA, 0.6, 0.6, 0.0, 0.45),
                 "branco": _material("Piso_branco", PAVIMENTO, 0.9)[0]}
    contagem = {}
    for c in planta["comodos"]:
        ob = bpy.data.objects.get(f"Piso_{c['id']}")  # nome exato: Piso_banheiro não pode pegar o da suíte
        if ob:
            tipo = PISO_POR_TIPO[c["piso"]]
            ob.data.materials.clear()
            ob.data.materials.append(materiais[tipo])
            contagem[tipo] = contagem.get(tipo, 0) + 1
    _aplicar(materiais["branco"], ["Laje do pavimento"])
    return contagem


def ripado():
    """Ripas verticais desenhadas no material, com relevo: faixas ao longo de x, em metros do Blender."""
    m, arvore, bsdf = _material("Ripado", RIPA, rugosidade=0.6)
    nos, ligar = arvore.nodes, arvore.links.new
    coord = nos.new("ShaderNodeTexCoord")
    onda = nos.new("ShaderNodeTexWave")
    onda.wave_type = "BANDS"
    onda.bands_direction = "X"
    onda.wave_profile = "SIN"
    # A onda em faixas tem período de 2π / (20 × escala) em x
    onda.inputs["Scale"].default_value = 2 * math.pi * RIPAS_POR_METRO / 20
    ligar(coord.outputs["Object"], onda.inputs["Vector"])
    rampa = nos.new("ShaderNodeValToRGB")
    rampa.color_ramp.interpolation = "CONSTANT"
    rampa.color_ramp.elements[0].color = _linear(FRESTA)
    rampa.color_ramp.elements[1].position = 0.2
    rampa.color_ramp.elements[1].color = _linear(RIPA)
    ligar(onda.outputs["Fac"], rampa.inputs["Fac"])
    ligar(rampa.outputs["Color"], bsdf.inputs["Base Color"])
    relevo = nos.new("ShaderNodeBump")
    relevo.inputs["Strength"].default_value = 0.4
    ligar(rampa.outputs["Color"], relevo.inputs["Height"])
    ligar(relevo.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def poche():
    """O topo das paredes cortadas ganha o grafite, como o preenchimento da parede numa planta impressa."""
    corte = _material("Corte", CORTE, 0.9)[0]
    faces = 0
    for ob in (bpy.data.objects.get("Paredes"),):  # só a unidade: os vizinhos ficam brancos, como contexto
        if not ob:
            continue
        malha = ob.data
        if corte.name not in [m.name for m in malha.materials if m]:
            malha.materials.append(corte)
        indice = [m.name if m else None for m in malha.materials].index(corte.name)
        topo = max(v.co.z for v in malha.vertices)
        for p in malha.polygons:
            if p.normal.z > 0.99 and abs(p.center.z - topo) < 1e-4:
                p.material_index = indice
                faces += 1
    return faces


def kit(movel, tecido, corte):
    """Cada material das peças do kit vira um da maquete, pelo nome que veio do kit (sem o .001, .002)."""
    trocas = {"Tecido": tecido, "Corte": corte}
    pecas = [ob for ob in bpy.data.objects if ob.type == "MESH" and ob.get("kit")]
    for ob in pecas:
        for slot in ob.material_slots:
            original = slot.material.name.split(".")[0] if slot.material else ""
            slot.material = trocas.get(KIT.get(original), movel)
    return len(pecas)


def acabamento_dos_moveis():
    """Cantos arredondados nos móveis da maquete e superfície lisa nas peças curvas (mesas, painel). As peças do
    kit já vêm com a geometria e as normais delas."""
    colecao = bpy.data.collections.get(maquete.COLECAO_MOVEIS)
    objetos = [ob for ob in colecao.objects if ob.type == "MESH" and not ob.get("kit")] if colecao else []
    for ob in objetos:
        if "Chanfro" not in ob.modifiers:
            chanfro = ob.modifiers.new("Chanfro", "BEVEL")
            chanfro.width = 0.005
            chanfro.segments = 3
            chanfro.limit_method = "ANGLE"
        if len(ob.data.polygons) > 12 and hasattr(ob.data, "set_sharp_from_angle"):  # curvo: mais que uma caixa
            for p in ob.data.polygons:
                p.use_smooth = True
            ob.data.set_sharp_from_angle(angle=math.radians(40))
    return len(objetos)


def contraste():
    """Um pouco mais de contraste no render. O nome do look muda entre versões do Blender."""
    for look in ("AgX - Medium High Contrast", "Medium High Contrast"):
        try:
            bpy.context.scene.view_settings.look = look
            return look
        except TypeError:
            continue
    return None


if __name__ == "__main__":
    movel = _material("Movel", MOVEL, rugosidade=0.9)[0]
    tecido_material = _material("Tecido", TECIDO, rugosidade=1.0)[0]
    moveis = _aplicar(movel, [ob.name for ob in bpy.data.collections[maquete.COLECAO_MOVEIS].objects])
    pecas_kit = kit(movel, tecido_material, _material("Corte", CORTE, 0.9)[0])
    paineis = _aplicar(ripado(), ("Painel ripado", "Painel curvo"))
    contagem = pisos()
    faces = poche()
    acabados = acabamento_dos_moveis()
    look = contraste()
    print(f"Arte: {moveis} móveis em branco fosco, {pecas_kit} peças do kit ({paineis} ripados, {acabados} com chanfro), "
          f"pisos {contagem}, {faces} faces de corte em grafite, "
          f"contraste: {look or 'não aplicado (look não encontrado nesta versão)'}.")
