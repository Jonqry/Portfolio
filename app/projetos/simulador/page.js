import Link from 'next/link';
import Comodo from '../../components/Comodo';

export const metadata = {
  title: 'Simulador de Financiamento: estudo de caso',
  description:
    'Como construí sozinho o simulador de financiamento que uso no plantão: cálculo em centavos, conferência com a Caixa e mais de 390 testes.',
};

const tecnologias = ['React', 'TypeScript', 'Vite', 'Tailwind', 'Recharts', 'Vitest', 'Playwright', 'GitHub Actions', 'Vercel'];

const decisoes = [
  {
    titulo: 'Dinheiro em centavos inteiros',
    texto:
      'Em ponto flutuante, 0,1 + 0,2 não dá 0,3, e o erro se acumula em 420 parcelas. O cálculo inteiro trabalha com centavos inteiros e só converte para reais na tela. Também escrevi as regras de arredondamento como especificação: no SAC, a última parcela absorve a sobra, e na PRICE ela quita o saldo.',
  },
  {
    titulo: 'Conferido com a simulação da Caixa',
    texto:
      'Simulei o mesmo cenário no site da Caixa: R$ 250 mil em Recife, 420 meses, MCMV com FGTS. Juros e amortização bateram centavo a centavo. A diferença estava nos seguros, então ajustei o MIP e o DFI. A primeira parcela passou a dar R$ 1.508,57, contra R$ 1.508,16 da Caixa.',
  },
  {
    titulo: 'Quanto o cliente pode comprar',
    texto:
      'É a pergunta que mais ouço no atendimento. Não existe fórmula fechada por causa dos seguros, então o simulador faz uma busca binária usando o mesmo cálculo da simulação. O teste confirma que o valor encontrado cabe na renda e que 1 centavo a mais já não cabe.',
  },
  {
    titulo: 'Feito para o WhatsApp',
    texto:
      'O resumo sai pronto para mandar ao cliente, com o link da simulação. A renda dele fica fora do texto, porque é dado pessoal. Quando a parcela não cabe, o envio é bloqueado e o painel mostra o imóvel máximo, a entrada e a renda necessárias.',
  },
];

const testes = [
  'Mais de 390 testes com Vitest, e 100% de cobertura na lógica de cálculo.',
  'Exemplos que dá para conferir à mão, valores de referência e regras que valem em qualquer cenário: as amortizações somam o valor financiado e o saldo termina em zero.',
  'Testes de ponta a ponta com Playwright, no computador e no celular, rodando a cada commit e de novo no site publicado depois de cada deploy.',
  'Um desses testes pegou um bug real: a seção de amortização extra fechava enquanto a pessoa corrigia um erro no campo.',
];

export default function Simulador() {
  return (
    <Comodo piso="taco" className="space-y-10">
      <header>
        <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Estudo de caso</p>
        <h1 className="titulo-pagina">Simulador de Financiamento</h1>
        <p className="intro-pagina">
          Um simulador de financiamento imobiliário que eu fiz sozinho para usar no meu trabalho de corretor.
        </p>
        <div className="cota-linha" aria-hidden="true" />
      </header>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Situação</h2>
        <div className="space-y-3 max-w-3xl text-[color:var(--tinta-suave)]">
          <p>
            Todo cliente pergunta se vale mais SAC ou PRICE, quanto vai pagar por mês e até quanto consegue
            financiar. No Minha Casa, Minha Vida, a resposta depende da faixa de renda, da região, do FGTS e
            do teto de valor de cada faixa.
          </p>
          <p>
            Um caso típico: o cliente ganha R$ 6 mil por mês e quer um imóvel de R$ 250 mil, com 20% de entrada
            e 35 anos para pagar. No SAC, a primeira parcela passa dos 30% da renda que o banco aceita. Na PRICE,
            ela cabe. Se o corretor não sabe disso na hora, o cliente sai do plantão achando que não consegue
            comprar.
          </p>
          <p>
            Fiz um simulador que responde essas perguntas na hora e gera um resumo para mandar ao cliente.
            Ele é público: qualquer corretor pode usar.
          </p>
        </div>
      </section>

      <figure className="max-w-3xl">
        <video
          className="imagem-projeto w-full h-auto"
          src="/projetos/simulador-uso.mp4"
          poster="/projetos/simulador-uso.jpg"
          width={800}
          height={600}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
        <figcaption className="text-sm text-[color:var(--tinta-suave)] mt-2">
          O caso acima no simulador: na PRICE a parcela cabe na renda, no SAC passa do limite, e ele mostra até
          quanto o cliente pode comprar em cada sistema.
        </figcaption>
      </figure>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">O que ele faz</h2>
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-[color:var(--tinta-suave)]">
          <li>Enquadra o cliente na faixa do MCMV pela renda e pelo valor do imóvel e escolhe a taxa.</li>
          <li>Compara SAC e PRICE, com seguros, CET e a tabela de amortização mês a mês.</li>
          <li>Calcula o imóvel máximo, avisa quando a parcela passa de 30% da renda e simula amortização com FGTS.</li>
          <li>Mostra os juros de obra para imóvel na planta e gera o resumo para o WhatsApp.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Decisões que tomei</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {decisoes.map((d) => (
            <article key={d.titulo} className="bloco">
              <h3 className="text-xl font-semibold mb-2">{d.titulo}</h3>
              <p className="text-[color:var(--tinta-suave)]">{d.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Como eu testo</h2>
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-[color:var(--tinta-suave)]">
          {testes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Como ele é montado</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">
          Toda a regra de negócio fica em funções puras, sem React, e a interface só mostra o resultado.
          O estado do formulário vai para a URL, então cada simulação vira um link que dá para compartilhar.
          Os gráficos são cerca de 60% do JavaScript, por isso só carregam depois da primeira tela.
          As decisões técnicas estão documentadas no repositório.
        </p>
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {tecnologias.map((tec) => (
            <li key={tec} className="etiqueta">{tec}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-5">
        <a href="https://simulador-financiamento-blush.vercel.app" target="_blank" rel="noopener noreferrer" className="link-texto">Abrir o simulador</a>
        <a href="https://github.com/Jonqry/simulador-financiamento" target="_blank" rel="noopener noreferrer" className="link-texto">Ver o código</a>
        <a href="https://github.com/Jonqry/simulador-financiamento/blob/main/docs/DECISOES.md" target="_blank" rel="noopener noreferrer" className="link-texto">Ler as decisões técnicas</a>
        <Link href="/projetos" className="link-texto">Voltar aos projetos</Link>
      </div>
    </Comodo>
  );
}
