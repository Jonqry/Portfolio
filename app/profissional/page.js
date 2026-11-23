import Link from 'next/link';
import Comodo from '../components/Comodo';

export const metadata = {
  title: 'Experiência',
  description: 'Experiência profissional de João Victor Varela: corretor de imóveis na Place Brokers e jovem aprendiz.',
};

const experiencias = [
  {
    cargo: 'Consultor de vendas (corretor de imóveis)',
    empresa: 'Place Brokers',
    periodo: 'desde outubro de 2025',
    atual: true,
    destaque: '8 vendas fechadas desde outubro de 2025.',
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

// Cada rotina do corretor e o que ela virou em código.
const pontes = [
  {
    rotina: 'Crédito',
    texto:
      'Todo cliente pergunta se vale mais SAC ou PRICE e até quanto consegue financiar. Fiz um simulador que responde as duas perguntas e avisa quando a parcela passa de 30% da renda.',
    link: 'Abrir o simulador',
    href: 'https://simulador-financiamento-blush.vercel.app',
    externo: true,
  },
  {
    rotina: 'Leads',
    texto:
      'O cliente se cadastra em vários lugares e fecha com quem responde primeiro. Na área do corretor do Place Brokers, isso decide o que vai para o topo de cada tela.',
    link: 'Ler o estudo de caso',
    href: '/projetos/place-brokers',
  },
  {
    rotina: 'Vendas',
    texto:
      'Telefone igual ou e-mail igual é o mesmo cliente, e a venda só conta depois que o gerente confirma. São regras do dia a dia da imobiliária que eu levei para o sistema.',
    link: 'Ver as decisões',
    href: '/projetos/place-brokers',
  },
];

export default function Profissional() {
  return (
    <Comodo piso="porcelanato" className="space-y-8">
      <header>
        <h1 className="titulo-pagina">Experiência</h1>
        <p className="intro-pagina">
          Antes da primeira vaga em tecnologia, aprendi a atender gente e a entender o que o cliente precisa.
        </p>
        <a href="/curriculo-joao-victor-varela.pdf" download className="botao botao-linha mt-5">Baixar currículo em PDF</a>
        <div className="cota-linha" aria-hidden="true" />
      </header>

      <ol className="linha-tempo space-y-10">
        {experiencias.map((exp) => (
          <li key={exp.cargo} className={exp.atual ? 'marco atual' : 'marco'}>
            <h2 className="text-2xl font-bold">{exp.cargo}</h2>
            <p className="text-[color:var(--tinta-suave)] mb-3">
              {exp.empresa}, {exp.periodo}
            </p>
            {exp.destaque && (
              <p className="mb-3 font-semibold">
                <span className="marca-texto">{exp.destaque}</span>
              </p>
            )}
            <ul className="space-y-1.5 list-disc pl-5 max-w-2xl">
              {exp.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-2">Do plantão para o código</h2>
        <p className="text-[color:var(--tinta-suave)] max-w-2xl mb-5">
          O que eu faço no atendimento virou o que eu programo.
        </p>
        <dl className="quadro max-w-3xl">
          {pontes.map((ponte) => (
            <div key={ponte.rotina}>
              <dt>{ponte.rotina}</dt>
              <dd>
                {ponte.texto}{' '}
                {ponte.externo ? (
                  <a href={ponte.href} target="_blank" rel="noopener noreferrer" className="link-texto">{ponte.link}</a>
                ) : (
                  <Link href={ponte.href} className="link-texto">{ponte.link}</Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Comodo>
  );
}
