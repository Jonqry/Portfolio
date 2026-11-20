import Image from 'next/image';
import Link from 'next/link';
import Comodo from '../components/Comodo';

export const metadata = {
  title: 'Projetos',
  description: 'Simulador de Financiamento, Place Brokers, CashFlow e outros projetos de João Victor Varela.',
};

const projetos = [
  {
    nome: 'Simulador de Financiamento',
    resumo: 'Projeto solo, feito para o dia a dia do corretor',
    descricao:
      'Compara SAC e PRICE lado a lado, com seguros, CET, tabela de amortização e gráficos. Calcula o imóvel máximo que o cliente pode comprar, sugere a taxa pela renda (faixas do Minha Casa, Minha Vida), simula amortização com FGTS e evolução de obra para imóvel na planta, e gera o resumo para enviar ao cliente pelo WhatsApp. Dinheiro em centavos inteiros, mais de 250 testes automatizados e testes de ponta a ponta com Playwright a cada deploy.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Recharts', 'Vitest', 'Playwright'],
    site: 'https://simulador-financiamento-blush.vercel.app',
    github: 'https://github.com/Jonqry/simulador-financiamento',
    marca: 'mais de 250 testes automatizados',
    destaque: true,
    imagem: '/simulador-financiamento.jpg',
    imagemAlt: 'Tela do simulador comparando SAC e PRICE, com tabela e gráficos',
    imagemLargura: 1600,
    imagemAltura: 1200,
  },
  {
    nome: 'Place Brokers',
    resumo: 'Plataforma de uma imobiliária real de Recife',
    descricao:
      'Projeto Integrador da Unicap, em equipe de cinco pessoas. O sistema tem site público, painel do administrador e área do corretor. Eu fiquei com a área do corretor: empreendimentos, leads, cadastro de clientes e agendamentos. Como sou corretor da imobiliária, também ajudei a definir as regras de negócio com o cliente.',
    tags: ['React 19', 'Tailwind', 'Supabase', 'Node.js'],
    site: 'https://placebrokers-frontend.vercel.app',
    github: 'https://github.com/Arthurms-dev/PI4-Place-Brokers-Integrador-FrontEnd',
    destaque: true,
    imagem: '/place-brokers-empreendimentos.jpg',
    imagemAlt: 'Lista de empreendimentos do site da Place Brokers',
    imagemLargura: 1512,
    imagemAltura: 785,
    avisoServidor: true,
    estudoDeCaso: '/projetos/place-brokers',
  },
  {
    nome: 'CashFlow',
    resumo: 'Controle de gastos da casa',
    descricao:
      'Projeto pessoal full-stack: API em C# com .NET e front-end em React com TypeScript. As regras de negócio são validadas no back-end e o código é organizado em camadas. Depois apliquei AppSec na API: login com JWT, senha salva só como hash, validação de entrada (que fechou uma falha de mass assignment), limite de tentativas contra força bruta e headers de segurança, tudo coberto por testes de integração.',
    tags: ['React', 'TypeScript', 'C# e .NET', 'SQLite', 'JWT', 'xUnit'],
    github: 'https://github.com/Jonqry/cashflow-fullstack',
  },
  {
    nome: 'Currículo Express',
    resumo: 'API REST de currículo',
    descricao:
      'API feita com Node.js, Express e PostgreSQL (NeonDB) como atividade da faculdade.',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
    site: 'https://curriculo-express-eta.vercel.app',
    siteRotulo: 'Testar a API',
    github: 'https://github.com/Jonqry/curriculo-express',
  },
  {
    nome: 'EcoCiclo',
    resumo: 'Logística reversa e descarte de resíduos',
    descricao:
      'Plataforma feita em equipe nas disciplinas de Front-end, Programação Orientada a Objetos e Análise de Projetos.',
    tags: ['React', 'Next.js', 'Leaflet'],
    github: 'https://github.com/Arthurms-dev/eco-ciclo-pfe-poo-aps',
  },
];

function Links({ projeto }) {
  return (
    <div className="flex flex-wrap gap-5">
      {projeto.site && (
        <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="link-texto">{projeto.siteRotulo ?? 'Abrir o site'}</a>
      )}
      <a href={projeto.github} target="_blank" rel="noopener noreferrer" className="link-texto">Ver o código</a>
      {projeto.estudoDeCaso && (
        <Link href={projeto.estudoDeCaso} className="link-texto">Ler o estudo de caso</Link>
      )}
    </div>
  );
}

// Passa o marca-texto no trecho indicado em projeto.marca, se houver.
function Descricao({ projeto }) {
  const { descricao, marca } = projeto;
  if (!marca || !descricao.includes(marca)) return descricao;
  const [antes, depois] = descricao.split(marca);
  return (
    <>
      {antes}
      <span className="marca-texto">{marca}</span>
      {depois}
    </>
  );
}

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1 mb-5">
      {tags.map((tag) => (
        <li key={tag} className="etiqueta">{tag}</li>
      ))}
    </ul>
  );
}

// Projeto em destaque: imagem e texto lado a lado, como a ficha de um empreendimento
function Destaque({ projeto, invertido }) {
  return (
    <article className="bloco grid md:grid-cols-2 gap-8 items-start">
      <div className={invertido ? 'md:order-2' : undefined}>
        <p className="estreito text-[color:var(--tinta-suave)] mb-1">{projeto.resumo}</p>
        <h2 className="text-3xl font-extrabold mb-3">{projeto.nome}</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4"><Descricao projeto={projeto} /></p>
        <Tags tags={projeto.tags} />
        <Links projeto={projeto} />
        {projeto.avisoServidor && (
          <p className="estreito text-sm text-[color:var(--tinta-suave)] mt-3">
            O servidor gratuito pode levar até um minuto para acordar na primeira visita.
          </p>
        )}
      </div>
      <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="imagem-projeto" tabIndex={-1} aria-hidden="true">
        <Image
          src={projeto.imagem}
          alt=""
          width={projeto.imagemLargura}
          height={projeto.imagemAltura}
          sizes="(max-width: 768px) 100vw, 500px"
          className="w-full h-auto"
        />
      </a>
    </article>
  );
}

function Outro({ projeto }) {
  return (
    <li className="grid md:grid-cols-[14rem_1fr] gap-x-8 gap-y-2 py-6 border-b border-[color:var(--linha)]">
      <div>
        <h3 className="text-xl font-bold">{projeto.nome}</h3>
        <p className="estreito text-[color:var(--tinta-suave)]">{projeto.resumo}</p>
      </div>
      <div>
        <p className="text-[color:var(--tinta-suave)] mb-3">{projeto.descricao}</p>
        <Tags tags={projeto.tags} />
        <Links projeto={projeto} />
      </div>
    </li>
  );
}

export default function Projetos() {
  return (
    <Comodo piso="porcelanato" className="space-y-10">
      <header>
        <h1 className="titulo-pagina">Projetos</h1>
        <p className="intro-pagina">O que eu construí na faculdade e por conta própria.</p>
      </header>

      <div className="cota-linha" aria-hidden="true" />

      <div className="space-y-14">
        {projetos.filter((projeto) => projeto.destaque).map((projeto, i) => (
          <Destaque key={projeto.nome} projeto={projeto} invertido={i % 2 === 1} />
        ))}
      </div>

      <section className="bloco">
        <h2 className="text-2xl font-extrabold">Outros projetos</h2>
        <ul>
          {projetos.filter((projeto) => !projeto.destaque).map((projeto) => (
            <Outro key={projeto.nome} projeto={projeto} />
          ))}
        </ul>
      </section>

      <p className="text-[color:var(--tinta-suave)]">
        Outros estudos estão no meu{' '}
        <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="link-texto">GitHub</a>.
      </p>
    </Comodo>
  );
}
