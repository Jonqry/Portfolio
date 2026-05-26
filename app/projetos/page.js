export default async function Projetos() {

  const res = await fetch('https://api.github.com/users/Jonqry/repos?sort=updated&per_page=6', {
    
    next: { revalidate: 3600 } 
  });

  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-2xl font-bold text-red-600">Erro ao carregar os projetos.</h1>
        <p className="text-gray-600 mt-4">Verifique se o nome de usuário do GitHub está correto no código.</p>
      </div>
    );
  }

  const projetos = await res.json();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Projetos Desenvolvidos
      </h1>
      <p className="text-gray-600">
        Dados consumidos em tempo real utilizando a <strong>API Pública do GitHub</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos.map((projeto) => (
          <a 
            key={projeto.id} 
            href={projeto.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-2 truncate" title={projeto.name}>
              {projeto.name}
            </h2>
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              {projeto.description || 'Nenhuma descrição fornecida para este repositório.'}
            </p>
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md">
                {projeto.language || 'Variado'}
              </span>
              <span className="text-blue-500 text-sm font-medium">Ver no GitHub →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}