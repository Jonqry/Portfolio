export default function Academico() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Experiência Acadêmica
      </h1>
      
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900">Formação em Tecnologia e Sistemas</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Atual</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">Foco em Desenvolvimento de Software e Infraestrutura</p>
          <p className="text-gray-700 leading-relaxed">
            Estudos aprofundados em engenharia de software, englobando tanto metodologias ágeis quanto tradicionais. Na parte de infraestrutura e base tecnológica, foco sólido em redes de computadores e na arquitetura da internet.
          </p>
        </div>
      </div>
    </div>
  );
}