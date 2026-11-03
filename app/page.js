import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="grid md:grid-cols-[1.15fr_1fr] gap-12 md:gap-16 items-center min-h-[70vh]">
        <div className="texto-entrada order-2 md:order-1">
          <p className="text-[color:var(--tinta-suave)] text-lg mb-4">Olá, eu sou o</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">João Victor Varela</h1>
          <p className="text-lg sm:text-xl text-[color:var(--tinta-suave)] max-w-xl mb-4">
            Desenvolvo interfaces com React e TypeScript e estudo Sistemas para Internet na Unicap.
          </p>
          <p className="text-lg sm:text-xl text-[color:var(--tinta-suave)] max-w-xl mb-8">
            De dia sou corretor de imóveis na Place Brokers. Hoje estou construindo, em equipe, o
            sistema da própria imobiliária, e fiquei com a área que eu mesmo uso: a do corretor.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projetos" className="botao botao-principal">Ver projetos</Link>
            <a href="https://www.linkedin.com/in/joaovictorvarela" target="_blank" rel="noopener noreferrer" className="botao botao-linha">LinkedIn</a>
            <a href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer" className="botao botao-linha">GitHub</a>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] grade-planta rounded-2xl">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible text-[color:var(--tinta)]"
              viewBox="0 0 360 360"
              fill="none"
              aria-hidden="true"
            >
              <path className="planta-traco" d="M30 30 H330 V330 H30 Z" stroke="currentColor" strokeWidth="4" />
              <path className="planta-traco atraso" d="M30 250 H60 M300 30 V60" stroke="var(--sol)" strokeWidth="4" strokeLinecap="round" />
              <g className="planta-cota" stroke="var(--tinta-suave)" strokeWidth="1.2">
                <path d="M30 352 H330 M30 346 V358 M330 346 V358" />
                <path d="M352 30 V330 M346 30 H358 M346 330 H358" />
              </g>
              <g className="planta-cota" fill="var(--tinta-suave)" fontSize="11" fontFamily="var(--font-corpo)">
                <text x="180" y="348" textAnchor="middle">3,20 m</text>
                <text x="348" y="184" textAnchor="middle" transform="rotate(90 348 184)">3,20 m</text>
              </g>
            </svg>
            <div className="foto-entrada absolute inset-[42px] rounded-xl overflow-hidden bg-[color:var(--linha)]">
              <Image
                src="/foto-joao.jpg"
                alt="Foto de João Victor Varela"
                fill
                priority
                sizes="(max-width: 640px) 196px, 276px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--linha)]/60 pt-10 mt-6 grid sm:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agora</h2>
          <p className="text-[color:var(--tinta-suave)]">
            Área do corretor do <Link href="/projetos" className="link-texto">Place Brokers</Link>, com React, Tailwind e Supabase.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Formação</h2>
          <p className="text-[color:var(--tinta-suave)]">Sistemas para Internet na Unicap, com conclusão em julho de 2027.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Procurando</h2>
          <p className="text-[color:var(--tinta-suave)]">
            Minha primeira vaga como desenvolvedor em Recife.{' '}
            <a href="mailto:joaovictorvarela321@gmail.com" className="link-texto">Fale comigo</a>
          </p>
        </div>
      </section>
    </div>
  );
}
