const tecnologias = [
  'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Next.js',
  'React Native / Expo', 'Node.js', 'C# / .NET', 'PostgreSQL / Supabase', 'Git',
];

const contatos = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joaovictorvarela' },
  { label: 'GitHub', href: 'https://github.com/Jonqry' },
  { label: 'E-mail', href: 'mailto:joaovictorvarela321@gmail.com' },
];

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2">
        Sobre mim
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Sou de Recife, estudo Sistemas para Internet na Unicap (termino em julho de 2027) e
          trabalho como corretor de imóveis na Place Brokers.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Meu foco é front-end com React e TypeScript. No Projeto Integrador, estou desenvolvendo
          com mais quatro colegas a plataforma da própria imobiliária onde trabalho. Fiquei com a
          área do corretor, e conhecer o dia a dia de quem usa o sistema me ajuda a decidir o que
          realmente importa em cada tela.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tecnologias que uso</h2>
        <div className="flex flex-wrap gap-2">
          {tecnologias.map((tec) => (
            <span key={tec} className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-md">
              {tec}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contato</h2>
        <div className="flex flex-wrap gap-3">
          {contatos.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Este site foi feito com Next.js (App Router) e Tailwind CSS e está publicado na Vercel.
      </p>
    </div>
  );
}
