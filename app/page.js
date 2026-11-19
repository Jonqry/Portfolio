import Link from 'next/link';
import planta from './planta.json';
import { px, caminhoContinuo, caminhoDeTrechos, porta, janela } from './planta-svg';

// A home é a planta de um apartamento: cada cômodo leva a uma parte do site.
// A geometria (em cm) vem da planta.json; aqui ficam só os textos e os links.
const textos = [
  {
    href: '/projetos',
    nome: 'Projetos',
    id: 'projetos',
    rotulo: 'Ver os 5 projetos',
    info: ['Simulador de Financiamento', 'Place Brokers', 'CashFlow e mais 2'],
  },
  {
    href: '/sobre',
    nome: 'Sobre',
    id: 'sobre',
    rotulo: 'Sobre mim',
    info: [],
    foto: true,
  },
  {
    href: '/profissional',
    nome: 'Experiência',
    id: 'experiencia',
    rotulo: 'Ver a experiência profissional',
    info: ['Corretor desde out/2025', 'Jovem aprendiz em 2025'],
  },
  {
    href: '/curriculo-joao-victor-varela.pdf',
    nome: 'Currículo',
    id: 'curriculo',
    rotulo: 'Abrir o currículo em PDF',
    info: ['PDF, 1 página'],
    externo: true,
  },
  {
    href: 'mailto:joaovictorvarela321@gmail.com',
    nome: 'Contato',
    id: 'contato',
    rotulo: 'Enviar e-mail',
    info: ['E-mail'],
  },
];

const comodos = textos.map((t) => {
  const g = planta.comodos.find((c) => c.id === t.id);
  return { ...t, x: px(g.x), y: px(g.y), w: px(g.largura), h: px(g.profundidade) };
});
const portas = planta.portas.map((p) => ({ id: p.id, ...porta(p) }));

function Planta() {
  return (
    <svg
      className="planta"
      viewBox="0 0 640 520"
      role="group"
      aria-label="Planta do site: escolha um cômodo"
    >
      <defs>
        <clipPath id="recorte-foto">
          <rect x="420" y="66" width="120" height="132" />
        </clipPath>
      </defs>

      {comodos.map((c) => (
        <a
          key={c.nome}
          href={c.href}
          aria-label={c.rotulo}
          data-comodo={c.id}
          {...(c.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <rect className="comodo-fundo" x={c.x + 3.5} y={c.y + 3.5} width={c.w - 7} height={c.h - 7} />
          {c.foto && (
            <>
              <image
                href="/foto-joao.jpg"
                x="420"
                y="66"
                width="120"
                height="132"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#recorte-foto)"
              />
              <rect className="foto-moldura" x="420" y="66" width="120" height="132" />
            </>
          )}
          <text className="comodo-nome" x={c.x + 22} y={c.foto ? c.y + 196 : c.y + 44}>
            {c.nome}
          </text>
          {c.foto ? (
            <text className="comodo-info" x={c.x + 22} y={c.y + 220}>Recife, Unicap</text>
          ) : (
            c.info.map((linha, i) => (
              <text key={linha} className="comodo-info" x={c.x + 22} y={c.y + 74 + i * 26}>
                {linha}
              </text>
            ))
          )}
        </a>
      ))}

      {/* paredes externas, com a abertura da porta de entrada no Contato */}
      <path
        className="parede planta-traco"
        d={caminhoContinuo(planta.paredesExternas)}
        aria-hidden="true"
      />
      {/* paredes internas, com vãos de porta */}
      <path
        className="parede planta-traco"
        d={caminhoDeTrechos(planta.paredesInternas)}
        aria-hidden="true"
      />

      <g className="planta-surge" aria-hidden="true">
        {/* portas: arco de abertura e folha. A folha gira na dobradiça (--dobradica) quando o
            cômodo dela recebe o mouse ou o foco; --fechada é o ângulo da porta fechada. */}
        {portas.map((p) => (
          <path key={`arco-${p.id}`} className="porta" d={p.arco} />
        ))}
        {portas.map((p) => (
          <path
            key={`folha-${p.id}`}
            className={`folha folha-${p.id}`}
            d={p.folha}
            style={{ '--dobradica': p.dobradica, '--fechada': p.fechada }}
          />
        ))}

        {/* janelas */}
        {planta.janelas.map((j, i) => (
          <rect key={i} className="janela" {...janela(j)} />
        ))}

        {/* cotas */}
        <path className="cota" d="M40 14 H600 M40 8 V20 M360 8 V20 M600 8 V20" />
        <text className="cota-texto" x="200" y="10" textAnchor="middle">6,40 m</text>
        <text className="cota-texto" x="480" y="10" textAnchor="middle">4,80 m</text>
        <path className="cota" d="M14 40 V460 M8 40 H20 M8 280 H20 M8 460 H20" />
        <text className="cota-texto" x="10" y="160" textAnchor="middle" transform="rotate(-90 10 160)">4,80 m</text>
        <text className="cota-texto" x="10" y="370" textAnchor="middle" transform="rotate(-90 10 370)">3,60 m</text>

        <text className="cota-texto" x="40" y="500">Planta do site, escala 1:50. Escolha um cômodo.</text>
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-14 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">João Victor Varela</h1>
          <p className="text-lg sm:text-xl text-[color:var(--tinta-suave)] max-w-xl mb-4">
            Desenvolvo com React, TypeScript e C# com .NET, e estudo Sistemas para Internet na Unicap.
          </p>
          <p className="text-lg sm:text-xl text-[color:var(--tinta-suave)] max-w-xl mb-8">
            De dia sou corretor de imóveis na Place Brokers. Por isso a minha casa aqui é{' '}
            <span className="marca-texto ao-abrir">uma planta</span>: é
            o que eu mostro aos clientes todo dia. Hoje estou construindo, em equipe, o sistema da própria
            imobiliária, e fiquei com a área que eu mesmo uso, a do corretor.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projetos" className="botao botao-principal">Ver projetos</Link>
            <a href="/curriculo-joao-victor-varela.pdf" download className="botao botao-linha">Baixar currículo</a>
          </div>
        </div>

        <div className="grade-planta p-3 sm:p-5">
          <Planta />
        </div>
      </section>

      <div className="cota-linha mt-14" aria-hidden="true" />
      <dl className="legenda grid sm:grid-cols-3 gap-8 pt-8">
        <div>
          <dt className="text-xl">Agora</dt>
          <dd>
            Área do corretor do <Link href="/projetos/place-brokers" className="link-texto">Place Brokers</Link>, com
            React, Tailwind e Supabase.
          </dd>
        </div>
        <div>
          <dt className="text-xl">Formação</dt>
          <dd>Sistemas para Internet na Unicap, com conclusão em julho de 2027.</dd>
        </div>
        <div>
          <dt className="text-xl">Procurando</dt>
          <dd>
            Estágio ou vaga júnior em desenvolvimento, em Recife.{' '}
            <a href="mailto:joaovictorvarela321@gmail.com" className="link-texto">Fale comigo</a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
