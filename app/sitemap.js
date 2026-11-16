const base = 'https://joaovictorvarela.vercel.app';

export default function sitemap() {
  return ['', '/projetos', '/projetos/place-brokers', '/sobre', '/profissional'].map((caminho) => ({
    url: base + caminho,
    changeFrequency: 'monthly',
    priority: caminho === '' ? 1 : 0.7,
  }));
}
