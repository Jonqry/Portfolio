import Image from 'next/image';

const projetos = [
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
  },
  {
    nome: 'CashFlow',
    resumo: 'Controle de gastos da casa',
    descricao:
      'Projeto pessoal full-stack: API em C# com .NET e front-end em React com TypeScript. As regras de negócio são validadas no back-end e o código é organizado em camadas.',
    tags: ['React', 'TypeScript', 'C# e .NET', 'SQLite'],
    github: 'https://github.com/Jonqry/cashflow-fullstack',
  },
  {
    nome: 'Currículo Express',
    resumo: 'API REST de currículo',
    descricao:
      'API feita com Node.js, Express e PostgreSQL (NeonDB) como atividade da faculdade.',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
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

function Projeto({ projeto }) {
  return (
    <article className={projeto.destaque ? 'bloco md:col-span-2 border-l-4 border-l-[color:var(--sol)]' : 'bloco'}>
      <p className="text-sm text-[color:var(--tinta-suave)] mb-1">{projeto.resumo}</p>
      <h2 className={projeto.destaque ? 'text-3xl font-bold mb-3' : 'text-2xl font-bold mb-3'}>{projeto.nome}</h2>
      <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">{projeto.descricao}</p>
      <ul className="flex flex-wrap gap-2 mb-5">
        {projeto.tags.map((tag) => (
          <li key={tag} className="etiqueta">{tag}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-5">
        {projeto.site && (
          <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="link-texto">Abrir o site</a>
        )}
        <a href={projeto.github} target="_blank" rel="noopener noreferrer" className="link-texto">Ver o código</a>
      </div>
      {projeto.imagem && (
        <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="block mt-6 rounded-xl overflow-hidden border border-[color:var(--linha)]/60">
          <Image
            src={projeto.imagem}
            alt={projeto.imagemAlt}
            width={1512}
            height={785}
            sizes="(max-width: 768px) 100vw, 900px"
            className="w-full h-auto"
          />
        </a>
      )}
      {projeto.site && projeto.destaque && (
        <p className="text-sm text-[color:var(--tinta-suave)] mt-3">
          O servidor gratuito pode levar até um minuto para acordar na primeira visita.
        </p>
      )}
    </article>
  );
}

export default function Projetos() {
  return (
    <div className="pagina space-y-8">
      <header>
        <h1 className="titulo-pagina">Projetos</h1>
        <p className="intro-pagina">O que eu construí na faculdade e por conta própria.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {projetos.map((projeto) => (
          <Projeto key={projeto.nome} projeto={projeto} />
        ))}
      </div>

      <p className="text-[color:var(--tinta-suave)]">
        Outros estudos estão no meu{' '}
        <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="link-texto">GitHub</a>.
      </p>
    </div>
  );
}
