export default function Profissional() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Experiência Profissional
      </h1>
      
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Jovem Aprendiz</h3>
          <p className="text-gray-500 text-sm mb-4">Foco Prático e Projetos</p>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <span>Atendimento ao público</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <span>Apoio em compras e operações internas</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <span>Suporte operacional</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✔</span>
              <span>Organização e higienização do ambiente</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}