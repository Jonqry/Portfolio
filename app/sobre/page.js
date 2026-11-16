import Link from 'next/link';

export const metadata = {
  title: 'Sobre',
  description: 'Quem é João Victor Varela: formação na Unicap, tecnologias que usa e o que está buscando.',
};

// Mesmo formato do quadro de áreas de uma planta: uma linha por área.
const tecnologias = [
  { area: 'Front-end', itens: 'React, TypeScript, JavaScript, Tailwind CSS e Next.js' },
  { area: 'Back-end', itens: 'C# com .NET, Node.js e Express' },
  { area: 'Dados', itens: 'PostgreSQL, Supabase e SQLite' },
  { area: 'Mobile', itens: 'React Native e Expo' },
  { area: 'Testes', itens: 'Vitest, Playwright e xUnit' },
  { area: 'Segurança', itens: 'JWT, validação de entrada e OWASP API Security Top 10' },
  { area: 'Ferramentas', itens: 'Git e GitHub' },
];

export default function Sobre() {
  return (
    <div className="pagina space-y-10">
      <header>
        <h1 className="titulo-pagina">Sobre mim</h1>
        <div className="cota-linha" aria-hidden="true" />
      </header>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Sou de Recife, estudo Sistemas para Internet na Unicap (termino em julho de 2027) e
            trabalho como corretor de imóveis na Place Brokers. Tenho inglês avançado.
          </p>
          <p>
            No Projeto Integrador, desenvolvo com mais quatro colegas a plataforma da própria imobiliária
            onde trabalho. Fiquei com a área do corretor. Saber como é o dia a dia de quem usa o sistema
            me ajuda a decidir o que realmente importa em cada tela.{' '}
            <Link href="/projetos/place-brokers" className="link-texto">Leia o estudo de caso</Link>.
          </p>
          <p>
            Comecei pelo front-end e estou indo para o back-end e o full-stack: já fiz APIs em Node.js e
            em C# com .NET. A área que mais me interessa é segurança de aplicações: no CashFlow, protegi a
            API seguindo o OWASP API Security Top 10 e cobri os controles principais com testes de integração.
          </p>
          <p>
            Busco estágio ou vaga júnior em desenvolvimento, em Recife. Posso começar logo e estagiar
            até o fim da faculdade.
          </p>
        </div>

        <aside className="bloco h-fit">
          <h2 className="text-xl font-semibold mb-4">Tecnologias que uso</h2>
          <dl className="quadro">
            {tecnologias.map((tec) => (
              <div key={tec.area}>
                <dt>{tec.area}</dt>
                <dd>{tec.itens}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <section id="formacao" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold">Formação</h2>
        <div className="bloco">
          <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Março de 2025 a julho de 2027</p>
          <h3 className="text-xl font-bold mb-1">Tecnólogo em Sistemas para Internet</h3>
          <p className="text-[color:var(--tinta-suave)] mb-3">Universidade Católica de Pernambuco (Unicap), 4º período</p>
          <p className="max-w-3xl">
            Disciplinas de desenvolvimento web e mobile, banco de dados e análise de projetos de software.
          </p>
        </div>
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

      <section className="bloco">
        <h2 className="text-xl font-semibold mb-2">Vamos conversar</h2>
        <p className="text-[color:var(--tinta-suave)] mb-5">
          Estou procurando meu primeiro estágio ou vaga júnior em desenvolvimento, em Recife.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:joaovictorvarela321@gmail.com" className="botao botao-principal">Enviar e-mail</a>
          <a href="https://www.linkedin.com/in/joaovictorvarela" target="_blank" rel="noopener noreferrer" className="botao botao-linha">LinkedIn</a>
          <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="botao botao-linha">GitHub</a>
          <a href="/curriculo-joao-victor-varela.pdf" download className="botao botao-linha">Baixar currículo</a>
        </div>
      </section>

      <p className="text-sm text-[color:var(--tinta-suave)]">
        Este site foi feito com Next.js e Tailwind CSS e está publicado na Vercel.
      </p>
    </div>
  );
}
