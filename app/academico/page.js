export default function Academico() {
  return (
    <div className="pagina space-y-8">
      <header>
        <h1 className="titulo-pagina">Formação</h1>
      </header>

      <section className="bloco border-l-4 border-l-[color:var(--sol)]">
        <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Março de 2025 a julho de 2027</p>
        <h2 className="text-2xl font-bold mb-1">Tecnólogo em Sistemas para Internet</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4">Universidade Católica de Pernambuco (Unicap), 4º período</p>
        <p className="max-w-3xl">
          Disciplinas de desenvolvimento web e mobile, banco de dados e análise de projetos de software.
          No Projeto Integrador, desenvolvo em equipe a plataforma da Place Brokers, com React, Tailwind,
          Supabase e Node.js.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Cursos</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          <li className="bloco">
            <h3 className="text-lg font-semibold">Office 365 e Power BI</h3>
            <p className="text-[color:var(--tinta-suave)]">Eduliv</p>
          </li>
          <li className="bloco">
            <h3 className="text-lg font-semibold">Multimídia</h3>
            <p className="text-[color:var(--tinta-suave)]">Escola Técnica Estadual Cícero Dias</p>
          </li>
        </ul>
      </section>
    </div>
  );
}
