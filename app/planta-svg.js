// Converte a planta (em cm) para o desenho SVG da home, na escala de 50 px por metro.

export const px = (cm) => cm / 2;

// Retângulo da planta na tela (x, y, largura, altura), em px.
export const VIEWBOX = [-34, -62, 504, 437];

export function caminhoContinuo(pontos) {
  return pontos.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x)} ${px(y)}`).join(' ');
}

export function caminhoDeTrechos(trechos) {
  return trechos.map((t) => caminhoContinuo(t)).join(' ');
}

const angulo = ([x, y], [cx, cy]) => (Math.atan2(y - cy, x - cx) * 180) / Math.PI;

// Arco de abertura, folha aberta e o ângulo que a folha gira até fechar no batente.
export function porta({ dobradica, batente, folhaAberta }) {
  let fechada = angulo(batente, dobradica) - angulo(folhaAberta, dobradica);
  if (fechada > 180) fechada -= 360;
  if (fechada <= -180) fechada += 360;
  const raio = px(Math.hypot(folhaAberta[0] - dobradica[0], folhaAberta[1] - dobradica[1]));
  const sentido = fechada > 0 ? 0 : 1;
  return {
    arco: `M${px(batente[0])} ${px(batente[1])} A${raio} ${raio} 0 0 ${sentido} ${px(folhaAberta[0])} ${px(folhaAberta[1])}`,
    folha: caminhoContinuo([dobradica, folhaAberta]),
    dobradica: `${px(dobradica[0])}px ${px(dobradica[1])}px`,
    fechada: `${Math.round(fechada)}deg`,
  };
}

// Janela desenhada como um retângulo de 8 px centrado na linha da parede.
export function janela([[x1, y1], [x2, y2]]) {
  const horizontal = y1 === y2;
  const ini = px(Math.min(horizontal ? x1 : y1, horizontal ? x2 : y2));
  const comprimento = px(Math.abs(horizontal ? x2 - x1 : y2 - y1));
  const linha = px(horizontal ? y1 : x1);
  return horizontal
    ? { x: ini, y: linha - 4, width: comprimento, height: 8 }
    : { x: linha - 4, y: ini, width: 8, height: comprimento };
}
