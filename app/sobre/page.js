export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Sobre Mim & O Projeto
      </h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Apresentação</h2>
        <p className="text-gray-700 leading-relaxed">
          Sou um estudante e desenvolvedor da área de sistemas, atuando em Recife. 
          Tenho direcionado minha trajetória para o desenvolvimento Full-Stack, unindo 
          a criação de interfaces dinâmicas com a construção de back-ends robustos, além 
          de possuir um forte interesse em metodologias de engenharia de software e 
          segurança da informação.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tecnologias Utilizadas no App</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">▹</span>
            <span><strong>React & Next.js:</strong> Framework base utilizando a nova arquitetura App Router.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">▹</span>
            <span><strong>Tailwind CSS:</strong> Framework utilitário para uma estilização rápida, responsiva e caprichada.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">▹</span>
            <span><strong>JavaScriptXML(JSX):</strong> Tipagem estática para garantir a segurança e manutenção do código.</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">▹</span>
            <span><strong>GitHub API (Integração):</strong> Utilizada para realizar o fetch dinâmico dos projetos desenvolvidos, conectando o portfólio aos repositórios reais.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}