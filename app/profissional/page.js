const experiencias = [
  {
    cargo: "Consultor de Vendas (corretor de imóveis)",
    empresa: "Place Brokers · out/2025 – atual",
    cor: "border-l-blue-600",
    itens: [
      "Atendimento de leads de campanhas no Instagram, Facebook e site",
      "Primeiro contato por ligação e WhatsApp, agendamento de reuniões e visitas",
      "Análise de crédito com o cliente (entrada e parcelas)",
      "Acompanhamento dos atendimentos no CRM Dommus",
    ],
  },
  {
    cargo: "Jovem Aprendiz",
    empresa: "Ferreiro Café · fev/2025 – out/2025",
    cor: "border-l-green-600",
    itens: [
      "Atendimento ao público",
      "Apoio em compras e operações internas",
      "Suporte operacional",
      "Organização e higienização do ambiente",
    ],
  },
];

export default function Profissional() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Experiência Profissional
      </h1>

      <div className="space-y-6">
        {experiencias.map((exp) => (
          <div
            key={exp.cargo}
            className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 ${exp.cor} hover:shadow-md transition-shadow`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.cargo}</h3>
            <p className="text-gray-500 text-sm mb-4">{exp.empresa}</p>
            <ul className="space-y-3 text-gray-700">
              {exp.itens.map((item) => (
                <li key={item} className="flex items-start">
                  <span className="text-green-600 mr-2">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
