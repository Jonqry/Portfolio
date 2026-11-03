const tecnologias = [
  'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js',
  'React Native e Expo', 'Node.js', 'C# e .NET', 'PostgreSQL e Supabase', 'Git',
];

export default function Sobre() {
  return (
    <div className="pagina space-y-10">
      <header>
        <h1 className="titulo-pagina">Sobre mim</h1>
      </header>

      <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Sou de Recife, estudo Sistemas para Internet na Unicap (termino em julho de 2027) e
            trabalho como corretor de imóveis na Place Brokers.
          </p>
          <p>
            No Projeto Integrador, estou desenvolvendo com mais quatro colegas a plataforma da própria
            imobiliária onde trabalho. Fiquei com a área do corretor. Saber como é o dia a dia de quem
            usa o sistema me ajuda a decidir o que realmente importa em cada tela.
          </p>
          <p>
            Gosto mais de front-end, mas também já fiz APIs em Node.js e em C# com .NET, e sigo
            aprendendo dos dois lados.
          </p>
        </div>

        <aside className="bloco h-fit">
          <h2 className="text-xl font-semibold mb-4">Tecnologias que uso</h2>
          <ul className="flex flex-wrap gap-2">
            {tecnologias.map((tec) => (
              <li key={tec} className="etiqueta">{tec}</li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="bloco">
        <h2 className="text-xl font-semibold mb-2">Vamos conversar</h2>
        <p className="text-[color:var(--tinta-suave)] mb-5">
          Estou procurando minha primeira vaga como desenvolvedor em Recife.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="mailto:joaovictorvarela321@gmail.com" className="botao botao-principal">Enviar e-mail</a>
          <a href="https://www.linkedin.com/in/joaovictorvarela" target="_blank" rel="noopener noreferrer" className="botao botao-linha">LinkedIn</a>
          <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="botao botao-linha">GitHub</a>
        </div>
      </section>

      <p className="text-sm text-[color:var(--tinta-suave)]">
        Este site foi feito com Next.js e Tailwind CSS e está publicado na Vercel.
      </p>
    </div>
  );
}
