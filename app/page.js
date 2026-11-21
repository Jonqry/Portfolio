import Link from 'next/link';
import planta from './planta.json';
import { px, caminhoContinuo, caminhoDeTrechos, porta, janela, VIEWBOX } from './planta-svg';
import DemoSimulador from './components/DemoSimulador';
import PlantaViva from './components/PlantaViva';

// A home é a planta de um apartamento: cada cômodo leva a uma parte do site (DESIGN.md, seção 3).
// A geometria (em cm) vem da planta.json, a mesma do modelo 3D; aqui ficam só os links e os rótulos.
const links = {
  simulador: { href: '#simulador', rotulo: 'Simulador: testar a demo nesta página' },
  'place-brokers': { href: '/projetos/place-brokers', rotulo: 'Place Brokers: ver o projeto' },
  cashflow: { href: '/projetos', rotulo: 'CashFlow: ver nos projetos' },
  'mais-projetos': { href: '/projetos', rotulo: 'Mais projetos: Currículo Express e EcoCiclo' },
  sobre: { href: '/sobre', rotulo: 'Sobre mim' },
  experiencia: { href: '/profissional', rotulo: 'Experiência profissional e currículo' },
  contato: { href: 'mailto:joaovictorvarela321@gmail.com', rotulo: 'Contato: enviar e-mail' },
};
// Nomes longos quebram em duas linhas para caber no cômodo
const linhas = {
  'place-brokers': ['Place', 'Brokers'],
  experiencia: ['Experiência', 'e currículo'],
  'mais-projetos': ['Mais', 'projetos'],
};
// Na área de serviço o nome desce um pouco, para fugir do giro da porta (classe desce, no globals.css)
const desce = new Set(['mais-projetos']);
// A porta que abre quando o cômodo recebe o mouse ou o foco (as regras ficam no globals.css)
const portaDe = { simulador: 'suite', 'place-brokers': 'quarto', 'mais-projetos': 'area-servico', experiencia: 'entrada' };

const retangulo = (c) => ({ x: px(c.x), y: px(c.y), w: px(c.largura), h: px(c.profundidade) });
const secoes = planta.comodos.filter((c) => links[c.id]).map((c) => ({ ...c, ...links[c.id], ...retangulo(c) }));
const outros = planta.comodos.filter((c) => !links[c.id]).map((c) => ({ id: c.id, ...retangulo(c) }));
const portas = planta.portas.map((p) => ({ id: p.id, ...porta(p) }));
const trecho = ({ de, ate }) => [de, ate];

function Planta() {
  return (
    <svg className="planta" viewBox={VIEWBOX.join(' ')} role="group" aria-label="Planta do site: escolha um cômodo">
      {outros.map((c) => (
        <rect key={c.id} className="comodo-apoio" x={c.x} y={c.y} width={c.w} height={c.h} />
      ))}

      {secoes.map((c) => (
        <a
          key={c.id}
          href={c.href}
          aria-label={c.rotulo}
          data-comodo={c.id}
          {...(portaDe[c.id] ? { 'data-porta': portaDe[c.id] } : {})}
        >
          <rect className="comodo-fundo" x={c.x} y={c.y} width={c.w} height={c.h} />
        </a>
      ))}

      <path className="parede planta-traco" d={caminhoDeTrechos(planta.paredes)} aria-hidden="true" />
      <path className="parede-fina" d={caminhoDeTrechos(planta.meiasParedes)} aria-hidden="true" />

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

        {/* janelas, o vão de vidro da varanda e o guarda-corpo */}
        {[...planta.janelas, ...planta.vaos].map((j, i) => (
          <rect key={i} className="janela" {...janela(trecho(j))} />
        ))}
        <path className="guarda-corpo" d={caminhoDeTrechos(planta.guardaCorpo)} />

        {/* cotas por fora das paredes: 9,20 × 5,30 m */}
        <path className="cota" d="M-2.5 -48 H457.5 M-2.5 -54 V-42 M457.5 -54 V-42" />
        <text className="cota-texto" x="227.5" y="-52" textAnchor="middle">9,20 m</text>
        <path className="cota" d="M-20 -2.5 V262.5 M-26 -2.5 H-14 M-26 262.5 H-14" />
        <text className="cota-texto" x="-24" y="130" textAnchor="middle" transform="rotate(-90 -24 130)">5,30 m</text>

        <text className="cota-texto" x="0" y="365">Planta do site, escala 1:50. Escolha um cômodo.</text>
      </g>

      {/* Os nomes vêm por cima das portas para o arco não cortar o texto. O nome acessível de cada
          cômodo é o aria-label do link, então os textos ficam fora da árvore de acessibilidade. */}
      <g className="rotulos" aria-hidden="true">
        {secoes.map((c) => {
          const nome = linhas[c.id] ?? [c.nome];
          const topo = c.y + c.h / 2 - (nome.length * 16.5 + 16) / 2 + 12; // centra nome e tipo no cômodo
          return (
            <text key={c.id} className={desce.has(c.id) ? 'desce' : undefined} x={c.x + c.w / 2} y={topo} textAnchor="middle">
              {nome.map((l, i) => (
                <tspan key={l} className="comodo-nome" x={c.x + c.w / 2} dy={i ? '1.1em' : 0}>{l}</tspan>
              ))}
              <tspan className="comodo-tipo" x={c.x + c.w / 2} dy="1.5em">{c.tipo}</tspan>
            </text>
          );
        })}
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
          <p className="text-lg text-[color:var(--tinta-suave)] max-w-xl mb-4">
            Desenvolvo com React, TypeScript e C# com .NET, e estudo Sistemas para Internet na Unicap.
          </p>
          <p className="text-lg text-[color:var(--tinta-suave)] max-w-xl mb-8">
            De dia sou corretor de imóveis na Place Brokers. Por isso a minha casa aqui é{' '}
            <span className="marca-texto ao-abrir">uma planta</span>: é
            o que eu mostro aos clientes todo dia. Hoje estou construindo, em equipe, o sistema da própria
            imobiliária, e fiquei com a área que eu mesmo uso, a do corretor.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projetos" className="botao botao-principal">Ver projetos</Link>
            <a href="/curriculo-joao-victor-varela.pdf" download className="botao botao-linha">Baixar currículo</a>
            <a href="#simulador" className="botao botao-linha">Testar o simulador</a>
          </div>
        </div>

        <div className="grade-planta p-3 sm:p-5">
          <PlantaViva>
            <Planta />
          </PlantaViva>
        </div>
      </section>

      <div className="mt-14">
        <DemoSimulador />
      </div>

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
            Estágio em desenvolvimento, em Recife.{' '}
            <a href="mailto:joaovictorvarela321@gmail.com" className="link-texto">Fale comigo</a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
