"""
Primeira passada automática da etapa de arte da maquete. Rode depois do maquete.py.

Como usar (Blender 5.3):
  Na aba Scripting, abra este arquivo e clique em Run Script, logo depois de rodar o maquete.py.
  Pelo terminal: blender blender/maquete.blend --python blender/maquete.py --python blender/arte.py

Diferente do maquete.py, este script sobrescreve os materiais que cria (Tecido, Ripado e o piso dos banheiros).
Para mudar uma cor, mude aqui e rode de novo, em vez de ajustar no Blender.
"""

import math

import bpy

TECIDO = "#EDE8DF"         # roupa de cama clara, para as camas não sumirem no taco
PISO_BANHEIRO = "#B9B5AD"  # banheiros sem seção mais escuros que os cômodos clicáveis
RIPA = "#C9AE84"           # a madeira dos móveis
FRESTA = "#8A6B45"         # o fundo entre as ripas
RIPAS_POR_METRO = 25       # ripa de 4 cm


def _linear(hexa):
    rgb = [int(hexa[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)


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
    cor = (*_linear(hexa), 1.0)
    bsdf.inputs["Base Color"].default_value = cor
    bsdf.inputs["Roughness"].default_value = rugosidade
    m.diffuse_color = cor
    return m, m.node_tree, bsdf


def _aplicar(material, prefixos):
    objetos = [ob for ob in bpy.data.objects if ob.type == "MESH" and ob.name.startswith(prefixos)]
    for ob in objetos:
        ob.data.materials.clear()
        ob.data.materials.append(material)
    return len(objetos)


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
    rampa.color_ramp.elements[0].color = (*_linear(FRESTA), 1.0)
    rampa.color_ramp.elements[1].position = 0.2
    rampa.color_ramp.elements[1].color = (*_linear(RIPA), 1.0)
    ligar(onda.outputs["Fac"], rampa.inputs["Fac"])
    ligar(rampa.outputs["Color"], bsdf.inputs["Base Color"])
    relevo = nos.new("ShaderNodeBump")
    relevo.inputs["Strength"].default_value = 0.4
    ligar(rampa.outputs["Color"], relevo.inputs["Height"])
    ligar(relevo.outputs["Normal"], bsdf.inputs["Normal"])
    return m


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
    camas = _aplicar(_material("Tecido", TECIDO, rugosidade=0.95)[0], ("Cama", "Travesseiro"))
    paineis = _aplicar(ripado(), ("Painel ripado", "Painel curvo"))
    banheiros = _aplicar(_material("Piso_banheiro_arte", PISO_BANHEIRO, rugosidade=0.5)[0],
                         ("Piso_banheiro",))
    look = contraste()
    print(f"Arte: {camas} peças de cama, {paineis} painéis ripados, {banheiros} pisos de banheiro, "
          f"contraste: {look or 'não aplicado (look não encontrado nesta versão)'}.")
