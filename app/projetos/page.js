const projetos = [
  {
    nome: "Place Brokers – plataforma imobiliária",
    descricao:
      "Projeto Integrador da Unicap, em equipe de 5, para uma imobiliária real de Recife: site público, painel do admin e área do corretor. Fiquei com a área do corretor (empreendimentos, leads, clientes e agendamentos).",
    tags: ["React 19", "Tailwind v4", "Supabase", "Node.js"],
    site: "https://placebrokers-frontend.vercel.app",
    github: "https://github.com/Arthurms-dev/PI4-Place-Brokers-Integrador-FrontEnd",
  },
  {
    nome: "CashFlow – controle de gastos",
    descricao:
      "Aplicação full-stack com API em C# e front-end em React com TypeScript. Regras de negócio validadas no back-end e código organizado em camadas.",
    tags: ["React", "TypeScript", "C# .NET", "SQLite"],
    github: "https://github.com/Jonqry/cashflow-fullstack",
  },
  {
    nome: "EcoCiclo",
    descricao:
      "Plataforma de logística reversa e descarte inteligente, feita em equipe nas disciplinas de Front-end, Programação Orientada a Objetos e Análise de Projetos.",
    tags: ["React", "Next.js", "Leaflet"],
    github: "https://github.com/Arthurms-dev/eco-ciclo-pfe-poo-aps",
  },
];

export default function Projetos() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Projetos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((projeto) => (
          <div
            key={projeto.nome}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-2">{projeto.nome}</h2>
            <p className="text-gray-600 text-sm mb-4 flex-grow">{projeto.descricao}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {projeto.tags.map((tag) => (
                <span key={tag} className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center gap-4 text-sm font-medium">
              {projeto.site && (
                <a href={projeto.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ver site →
                </a>
              )}
              <a href={projeto.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                Código no GitHub →
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-600">
        Outros projetos estão no meu{" "}
        <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
