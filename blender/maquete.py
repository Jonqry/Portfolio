"""
Monta a base da maquete no Blender a partir de app/planta.json.

Como usar (Blender 5.3):
  1. Na aba Scripting, abra este arquivo e clique em Run Script.
     Pelo terminal também funciona: blender --python blender/maquete.py
  2. O script cria a coleção "Maquete (gerada)". Rodar de novo apaga e refaz só essa coleção,
     então tudo que você modelar à mão (móveis, árvores, luz, câmera) fica em outras coleções.
     Materiais que já existem com o mesmo nome não são alterados.

Convenções: 1 unidade do Blender = 1 m e o centro da casa fica na origem. Na planta o eixo y
cresce para baixo; aqui Y cresce para cima, então a vista de topo (numpad 7) mostra a casa na
mesma posição do SVG da home.
"""

import json
import math
import os

COLECAO = "Maquete (gerada)"
MARGEM_PLACA = 300      # cm de terreno em volta da casa
ESPESSURA_PLACA = 30    # cm de MDF
ESPESSURA_FOLHA = 4     # cm
FOLGA_PORTA = 1         # cm entre a folha e o batente
ESPESSURA_VIDRO = 2     # cm
ALTURA_PISO = 0.2       # cm acima do gramado, para não brigar com ele

CORES = {
    "Parede": "#F3F2EE",
    "Porta": "#F3F2EE",
    "Acrilico": "#CFE3E6",
    "Gramado": "#3F6B40",
    "MDF": "#B0916A",
    "porcelanato": "#D8D6CF",
    "taco": "#B98A57",
    "ceramica": "#E4E2DC",
    "varanda": "#C7C4BA",
}


# ---------- geometria (Python puro, em cm, coordenadas da planta) ----------

def segmentos(linhas):
    return [(linha[i], linha[i + 1]) for linha in linhas for i in range(len(linha) - 1)]


def _no_segmento(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p, a, b
    if x1 == x2:
        return x == x1 and min(y1, y2) <= y <= max(y1, y2)
    return y == y1 and min(x1, x2) <= x <= max(x1, x2)


def _retangulo_linha(a, b, t, esticar_a=0, esticar_b=0):
    """Retângulo (x0, x1, y0, y1) de espessura t em volta do trecho a→b."""
    (x1, y1), (x2, y2) = a, b
    h = t / 2
    if y1 == y2:
        s = 1 if x2 > x1 else -1
        xa, xb = x1 - s * esticar_a, x2 + s * esticar_b
        return (min(xa, xb), max(xa, xb), y1 - h, y1 + h)
    if x1 == x2:
        s = 1 if y2 > y1 else -1
        ya, yb = y1 - s * esticar_a, y2 + s * esticar_b
        return (x1 - h, x1 + h, min(ya, yb), max(ya, yb))
    raise ValueError(f"Parede inclinada não é suportada: {a} → {b}")


def blocos_paredes(planta):
    """Blocos (x0, x1, y0, y1, z0, z1) que somados formam as paredes, o guarda-corpo e as vergas
    de portas e vãos, e os vãos de janela que devem ser retirados deles."""
    t = planta["espessuraParede"]
    alt = planta["alturas"]
    trechos = [(s, alt["peDireito"]) for s in segmentos(planta["paredes"])]
    trechos += [(s, alt["guardaCorpo"]) for s in segmentos(planta.get("guardaCorpo", []))]
    blocos = []
    for i, ((a, b), altura) in enumerate(trechos):
        outros = [s for j, (s, _) in enumerate(trechos) if j != i]
        # A ponta que encosta em outra parede estica meia espessura para fechar o canto.
        # A ponta solta (vão de porta) fica no eixo, como no SVG.
        ea = t / 2 if any(_no_segmento(a, *s) for s in outros) else 0
        eb = t / 2 if any(_no_segmento(b, *s) for s in outros) else 0
        blocos.append((*_retangulo_linha(a, b, t, ea, eb), 0, altura))
    for p in planta["portas"]:
        blocos.append((*_retangulo_linha(p["batente"], p["dobradica"], t), alt["verga"], alt["peDireito"]))
    for v in planta.get("vaos", []):
        blocos.append((*_retangulo_linha(v["de"], v["ate"], t), alt["verga"], alt["peDireito"]))
    janelas = [(*_retangulo_linha(j["de"], j["ate"], t), j.get("peitoril", alt["peitoril"]), alt["verga"])
               for j in planta["janelas"]]
    return blocos, janelas


def _uniao(intervalos):
    res = []
    for a, b in sorted(intervalos):
        if res and a <= res[-1][1]:
            res[-1] = (res[-1][0], max(res[-1][1], b))
        else:
            res.append((a, b))
    return res


def _menos(intervalos, retirar):
    res = []
    for a, b in intervalos:
        partes = [(a, b)]
        for c, d in retirar:
            novas = []
            for x, y in partes:
                if d <= x or c >= y:
                    novas.append((x, y))
                    continue
                if c > x:
                    novas.append((x, c))
                if d < y:
                    novas.append((d, y))
            partes = novas
        res += partes
    return res


def malha_paredes(planta):
    """Uma malha fechada só, sem faces internas, para o chanfro e o bake saírem limpos.
    Devolve vértices (cm, coordenadas da planta) e faces com a normal para fora."""
    blocos, vaos = blocos_paredes(planta)
    xs = sorted({v for r in blocos + vaos for v in r[0:2]})
    ys = sorted({v for r in blocos + vaos for v in r[2:4]})

    perfil = {}
    for i in range(len(xs) - 1):
        cx = (xs[i] + xs[i + 1]) / 2
        for j in range(len(ys) - 1):
            cy = (ys[j] + ys[j + 1]) / 2
            dentro = [r for r in blocos if r[0] < cx < r[1] and r[2] < cy < r[3]]
            if not dentro:
                continue
            alturas = _uniao([(r[4], r[5]) for r in dentro])
            alturas = _menos(alturas, [(v[4], v[5]) for v in vaos if v[0] < cx < v[1] and v[2] < cy < v[3]])
            if alturas:
                perfil[(i, j)] = alturas

    vertices, faces = {}, []

    def face(*pontos):
        faces.append(tuple(vertices.setdefault(p, len(vertices)) for p in pontos))

    for (i, j), alturas in perfil.items():
        x0, x1, y0, y1 = xs[i], xs[i + 1], ys[j], ys[j + 1]
        for z0, z1 in alturas:
            face((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1))
            face((x0, y1, z0), (x1, y1, z0), (x1, y0, z0), (x0, y0, z0))
            for za, zb in _menos([(z0, z1)], perfil.get((i + 1, j), [])):
                face((x1, y0, za), (x1, y1, za), (x1, y1, zb), (x1, y0, zb))
            for za, zb in _menos([(z0, z1)], perfil.get((i - 1, j), [])):
                face((x0, y0, zb), (x0, y1, zb), (x0, y1, za), (x0, y0, za))
            for za, zb in _menos([(z0, z1)], perfil.get((i, j + 1), [])):
                face((x1, y1, za), (x0, y1, za), (x0, y1, zb), (x1, y1, zb))
            for za, zb in _menos([(z0, z1)], perfil.get((i, j - 1), [])):
                face((x0, y0, za), (x1, y0, za), (x1, y0, zb), (x0, y0, zb))

    # Costura as junções em T: um vértice no meio da aresta de outra face entra nela também,
    # senão a malha fica com frestas e o chanfro sai torto.
    pontos = [p for p, _ in sorted(vertices.items(), key=lambda kv: kv[1])]
    costuradas = []
    for f in faces:
        nova = []
        for k, i in enumerate(f):
            a, b = pontos[i], pontos[f[(k + 1) % len(f)]]
            nova.append(i)
            meio = [m for m, p in enumerate(pontos) if _entre(p, a, b)]
            nova += sorted(meio, key=lambda m: math.dist(pontos[m], a))
        costuradas.append(tuple(nova))
    return pontos, costuradas


def _entre(p, a, b):
    """p está no meio da aresta a–b (as arestas aqui são sempre paralelas a um eixo)."""
    eixos = [d for d in range(3) if a[d] != b[d]]
    if len(eixos) != 1:
        return False
    e = eixos[0]
    return all(p[d] == a[d] for d in range(3) if d != e) and min(a[e], b[e]) < p[e] < max(a[e], b[e])


def centro(planta):
    c = planta["comodos"]
    x0 = min(r["x"] for r in c)
    x1 = max(r["x"] + r["largura"] for r in c)
    y0 = min(r["y"] for r in c)
    y1 = max(r["y"] + r["profundidade"] for r in c)
    return (x0 + x1) / 2, (y0 + y1) / 2, (x0, x1, y0, y1)


def para_blender(planta, vertices, faces):
    """cm da planta → metros do Blender. Inverter o y espelha a malha, então a ordem
    dos vértices de cada face também inverte para a normal continuar para fora."""
    cx, cy, _ = centro(planta)
    vs = [((x - cx) / 100, -(y - cy) / 100, z / 100) for x, y, z in vertices]
    return vs, [tuple(reversed(f)) for f in faces]


def caixa(x0, x1, y0, y1, z0, z1):
    """Caixa alinhada aos eixos, já em coordenadas do Blender. A face 1 é o topo."""
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
         (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return v, f


def _angulo(p, c):
    return math.degrees(math.atan2(p[1] - c[1], p[0] - c[0]))


def dados_porta(planta, p):
    """Posição da dobradiça, ângulo da folha aberta e o giro até fechar, já no Blender."""
    cx, cy, _ = centro(planta)
    fechada = _angulo(p["batente"], p["dobradica"]) - _angulo(p["folhaAberta"], p["dobradica"])
    fechada = (fechada + 180) % 360 - 180
    largura = math.dist(p["dobradica"], p["folhaAberta"])
    return {
        "local": ((p["dobradica"][0] - cx) / 100, -(p["dobradica"][1] - cy) / 100, 0.0),
        # y invertido: o ângulo da planta troca de sinal no Blender
        "rotacao": math.radians(-_angulo(p["folhaAberta"], p["dobradica"])),
        "fechada_graus": -fechada,
        "largura": (largura - FOLGA_PORTA) / 100,
    }


# ---------- Blender ----------

def _linear(hexa):
    rgb = [int(hexa[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)


def _material(bpy, nome, hexa, rugosidade=0.9, transmissao=0.0):
    existente = bpy.data.materials.get(nome)
    if existente:
        return existente  # não sobrescreve o que você já ajustou
    m = bpy.data.materials.new(nome)
    if hasattr(m, "use_nodes") and not m.use_nodes:
        m.use_nodes = True
    cor = (*_linear(hexa), 1.0)
    m.diffuse_color = cor
    if m.node_tree:
        bsdf = next((n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf:
            bsdf.inputs["Base Color"].default_value = cor
            bsdf.inputs["Roughness"].default_value = rugosidade
            entrada = bsdf.inputs.get("Transmission Weight")
            if entrada and transmissao:
                entrada.default_value = transmissao
    return m


def _colecao_limpa(bpy):
    col = bpy.data.collections.get(COLECAO)
    if col is None:
        col = bpy.data.collections.new(COLECAO)
        bpy.context.scene.collection.children.link(col)
        return col
    for ob in list(col.all_objects):
        malha = ob.data
        bpy.data.objects.remove(ob, do_unlink=True)
        if isinstance(malha, bpy.types.Mesh) and malha.users == 0:
            bpy.data.meshes.remove(malha)
    return col


def _objeto(bpy, col, nome, vertices, faces, materiais, indices=None, uvs=None):
    malha = bpy.data.meshes.new(nome)
    malha.from_pydata(vertices, [], faces)
    for m in materiais:
        malha.materials.append(m)
    if indices:
        for poligono, i in zip(malha.polygons, indices):
            poligono.material_index = i
    if uvs:
        camada = malha.uv_layers.new(name="UVMap")
        for laco in malha.loops:
            camada.data[laco.index].uv = uvs[laco.vertex_index]
    malha.update()
    ob = bpy.data.objects.new(nome, malha)
    col.objects.link(ob)
    return ob


def caminho_planta():
    bases = []
    if "__file__" in globals():
        bases.append(os.path.dirname(os.path.abspath(__file__)))
    try:
        import bpy
        for texto in bpy.data.texts:
            if texto.filepath and os.path.basename(texto.filepath) == "maquete.py":
                bases.append(os.path.dirname(bpy.path.abspath(texto.filepath)))
    except ImportError:
        pass
    for base in bases:
        caminho = os.path.normpath(os.path.join(base, "..", "app", "planta.json"))
        if os.path.exists(caminho):
            return caminho
    raise FileNotFoundError("Não achei app/planta.json. Abra o maquete.py que está na pasta blender/ do repositório.")


def construir():
    import bpy
    import bmesh

    with open(caminho_planta(), encoding="utf-8") as f:
        planta = json.load(f)
    col = _colecao_limpa(bpy)
    mat = {nome: _material(bpy, nome, CORES[nome]) for nome in ("Parede", "Porta", "Gramado", "MDF")}
    mat["Acrilico"] = _material(bpy, "Acrilico", CORES["Acrilico"], rugosidade=0.05, transmissao=0.9)
    cx, cy, (bx0, bx1, by0, by1) = centro(planta)
    alt = planta["alturas"]

    # Paredes: uma malha só, com chanfro não destrutivo
    vs, fs = para_blender(planta, *malha_paredes(planta))
    paredes = _objeto(bpy, col, "Paredes", vs, fs, [mat["Parede"]])
    bm = bmesh.new()
    bm.from_mesh(paredes.data)
    bmesh.ops.dissolve_limit(bm, angle_limit=math.radians(1), verts=bm.verts[:], edges=bm.edges[:])
    bm.to_mesh(paredes.data)
    bm.free()
    chanfro = paredes.modifiers.new("Chanfro", "BEVEL")
    chanfro.width = 0.008
    chanfro.segments = 2
    chanfro.limit_method = "ANGLE"

    # Placa da maquete: topo de gramado, laterais de MDF
    m = MARGEM_PLACA
    vs, fs = caixa((bx0 - m - cx) / 100, (bx1 + m - cx) / 100, -(by1 + m - cy) / 100, -(by0 - m - cy) / 100,
                   -ESPESSURA_PLACA / 100, 0.0)
    _objeto(bpy, col, "Placa", vs, fs, [mat["MDF"], mat["Gramado"]], indices=[0, 1, 0, 0, 0, 0])

    # Pisos: um objeto e um material por cômodo, para trocar a textura de cada projeto sem refazer o bake.
    # Vão até o eixo das paredes, para não sobrar fresta entre cômodos abertos (sala, jantar, cozinha).
    for c in planta["comodos"]:
        x0, x1 = (c["x"] - cx) / 100, (c["x"] + c["largura"] - cx) / 100
        y0, y1 = -(c["y"] + c["profundidade"] - cy) / 100, -(c["y"] - cy) / 100
        z = ALTURA_PISO / 100
        piso = _material(bpy, f"Piso_{c['id']}", CORES[c["piso"]], rugosidade=0.7)
        _objeto(bpy, col, f"Piso_{c['id']}", [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)], [(0, 1, 2, 3)],
                [piso], uvs=[(0, 0), (1, 0), (1, 1), (0, 1)])

    # Portas: origem na dobradiça, para o site girar a folha. "fechada_graus" vai no glTF (extras).
    for p in planta["portas"]:
        d = dados_porta(planta, p)
        e = ESPESSURA_FOLHA / 100
        vs, fs = caixa(0, d["largura"], -e / 2, e / 2, 0, (alt["verga"] - FOLGA_PORTA) / 100)
        ob = _objeto(bpy, col, f"Porta_{p['id']}", vs, fs, [mat["Porta"]])
        ob.location = d["local"]
        ob.rotation_euler[2] = d["rotacao"]
        ob["fechada_graus"] = d["fechada_graus"]

    # Janelas e portas de vidro: placa de acrílico no meio da parede, entre o peitoril e a verga
    vidros = [(j["de"], j["ate"], j.get("peitoril", alt["peitoril"])) for j in planta["janelas"]]
    vidros += [(v["de"], v["ate"], 0) for v in planta.get("vaos", []) if v["vidro"]]
    for i, (a, b, peitoril) in enumerate(vidros, start=1):
        x0, x1, y0, y1 = _retangulo_linha(a, b, ESPESSURA_VIDRO)
        vs, fs = caixa((x0 - cx) / 100, (x1 - cx) / 100, -(y1 - cy) / 100, -(y0 - cy) / 100,
                       peitoril / 100, alt["verga"] / 100)
        _objeto(bpy, col, f"Vidro_{i}", vs, fs, [mat["Acrilico"]])

    print(f"Maquete montada: {len(col.objects)} objetos em '{COLECAO}'.")


if __name__ == "__main__":
    construir()
