const experiencias = [
  {
    cargo: 'Consultor de vendas (corretor de imóveis)',
    empresa: 'Place Brokers',
    periodo: 'desde outubro de 2025',
    atual: true,
    itens: [
      'Atendo leads que chegam pelas campanhas no Instagram, no Facebook e pelo site.',
      'Faço o primeiro contato por ligação e WhatsApp e agendo reuniões e visitas.',
      'Faço a análise de crédito com o cliente: entrada e valor das parcelas.',
      'Acompanho os atendimentos no CRM Dommus.',
    ],
  },
  {
    cargo: 'Jovem Aprendiz',
    empresa: 'Ferreiro Café',
    periodo: 'de fevereiro a outubro de 2025',
    itens: [
      'Atendimento ao público.',
      'Apoio nas compras e nas operações internas.',
      'Organização do ambiente e suporte operacional.',
    ],
  },
];

export default function Profissional() {
  return (
    <div className="pagina space-y-8">
      <header>
        <h1 className="titulo-pagina">Experiência</h1>
        <p className="intro-pagina">
          Antes da primeira vaga em tecnologia, aprendi a atender gente e a entender o que o cliente precisa.
        </p>
      </header>

      <ol className="linha-tempo space-y-10">
        {experiencias.map((exp) => (
          <li key={exp.cargo} className={exp.atual ? 'marco atual' : 'marco'}>
            <h2 className="text-2xl font-bold">{exp.cargo}</h2>
            <p className="text-[color:var(--tinta-suave)] mb-3">
              {exp.empresa}, {exp.periodo}
            </p>
            <ul className="space-y-1.5 list-disc pl-5 max-w-2xl">
              {exp.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
