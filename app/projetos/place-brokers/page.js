import Image from 'next/image';
import Link from 'next/link';
import Comodo from '../../components/Comodo';
import CotaLeitura from '../../components/CotaLeitura';
import Ficha from '../../components/Ficha';
import ProximoComodo from '../../components/ProximoComodo';

export const metadata = {
  title: 'Place Brokers: estudo de caso',
  description:
    'Como construí a área do corretor da plataforma de uma imobiliária real de Recife, no Projeto Integrador da Unicap.',
};

const resultado = {
  texto: 'Em 17/11/2026 apresentei a plataforma completa para a diretoria da Place, e a recepção foi positiva.',
};

const numeros = [
  { valor: 5, rotulo: 'pessoas na equipe' },
  { valor: 3, rotulo: 'áreas: site público, painel do administrador e área do corretor' },
];

const tecnologias = [
  'React 19', 'React Router 7', 'Vite', 'Tailwind 4',
  'Supabase (PostgreSQL)', 'Node.js e Express', 'Vercel', 'Render',
];

const decisoes = [
  {
    titulo: 'Cadastro sem duplicar cliente',
    texto:
      'O mesmo cliente costuma se cadastrar em vários lugares. Defini com o time que telefone igual ou e-mail igual significa a mesma pessoa, mesmo com nome diferente. Assim a base não se enche de duplicados.',
  },
  {
    titulo: 'Venda só conta depois de confirmada',
    texto:
      'O corretor registra o valor da venda, o gerente da equipe confirma e só então ela entra no VGV que o administrador vê. Foi a forma de os números do painel serem confiáveis.',
  },
  {
    titulo: 'Preço que não engana o cliente',
    texto:
      'Em lançamentos do Minha Casa, Minha Vida o site mostra "parcelas a partir de". Nos demais, mostra o valor da unidade mais barata. Imóveis prontos e usados mostram o preço cheio, porque a entrada é à vista.',
  },
  {
    titulo: 'Escopo do MVP enxuto',
    texto:
      'Deixei de fora, de propósito, atualização em tempo real, envio de e-mail e o app mobile. Para o aviso de agendamento, bastou um aviso dentro do site, e a agenda do celular entra com um arquivo .ics. Menos peças, entrega no prazo.',
  },
];

const entregas = [
  'Lista de empreendimentos com filtros, para o corretor achar o que vender.',
  'Meus leads: os contatos que o administrador direciona para o corretor.',
  'Cadastro de clientes, com a regra de não duplicar.',
  'Agendamentos de reuniões e visitas, que o corretor altera e o administrador acompanha.',
  'Barra lateral e menu do usuário no mesmo padrão do painel do administrador.',
];

export default function PlaceBrokers() {
  return (
    <Comodo piso="taco" className="space-y-10">
      <header>
        <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Estudo de caso</p>
        <h1 className="titulo-pagina">Place Brokers</h1>
        <p className="intro-pagina">
          Como construí a área do corretor da plataforma da imobiliária onde eu trabalho, no Projeto
          Integrador da Unicap.
        </p>
        <div className="cota-linha" aria-hidden="true" />
      </header>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Situação</h2>
        <div className="space-y-3 max-w-3xl text-[color:var(--tinta-suave)]">
          <p>
            A Place Brokers é uma imobiliária de Recife que vende lançamentos de várias construtoras. Os
            leads chegam por anúncios no Instagram e no Facebook e pelo site. O atendimento acontece
            no CRM, e parte do acompanhamento dos corretores fica em planilhas e relatórios dos gerentes.
          </p>
          <p>
            No Projeto Integrador, uma equipe de cinco pessoas recebeu o desafio de construir uma
            plataforma para a empresa, com site público, painel do administrador e área do corretor.
            Eu trabalho lá como corretor desde outubro de 2025, então conheço o problema por dentro.
          </p>
        </div>
      </section>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Minha parte</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">
          Fiquei responsável pela área do corretor. Também levei para o grupo as regras de negócio que
          só quem atende cliente conhece e ajudei a definir essas regras junto com o cliente.
        </p>
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-[color:var(--tinta-suave)]">
          {entregas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <figure className="max-w-3xl">
        <video
          className="imagem-projeto w-full h-auto"
          src="/projetos/place-brokers-uso.mp4"
          poster="/projetos/place-brokers-uso.jpg"
          width={800}
          height={500}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
        <figcaption className="text-sm text-[color:var(--tinta-suave)] mt-2">
          A área do corretor: o início, os empreendimentos com o filtro do Minha Casa, Minha Vida e os leads.
          Nomes e telefones dos clientes estão borrados.
        </figcaption>
      </figure>

      <Ficha itens={numeros} />

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
        <h2 className="text-2xl font-bold mb-3">Como o sistema é montado</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">
          O front-end é uma aplicação em React, publicada na Vercel. Ele conversa com uma API em Node.js e
          Express, organizada em camadas (rotas, controllers, services e repositórios), publicada no Render.
          Os dados ficam no PostgreSQL do Supabase, com as mudanças de tabela versionadas em migrations.
          A equipe trabalha em um repositório compartilhado, com divisão clara de telas entre os integrantes.
        </p>
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {tecnologias.map((tec) => (
            <li key={tec} className="etiqueta">{tec}</li>
          ))}
        </ul>
      </section>

      {resultado && (
        <section className="bloco">
          <h2 className="text-2xl font-bold mb-3">Resultado</h2>
          <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">{resultado.texto}</p>
          {resultado.itens && (
            <ul className="space-y-2 max-w-3xl list-disc pl-5 text-[color:var(--tinta-suave)]">
              {resultado.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-6">
        <a
          href="https://placebrokers-frontend.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="imagem-projeto"
        >
          <Image
            src="/place-brokers-home.jpg"
            alt="Página inicial do site da Place Brokers"
            width={1512}
            height={785}
            sizes="(max-width: 768px) 100vw, 500px"
            className="w-full h-auto"
          />
        </a>
        <a
          href="https://placebrokers-frontend.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="imagem-projeto"
        >
          <Image
            src="/place-brokers-empreendimentos.jpg"
            alt="Lista de empreendimentos do site da Place Brokers"
            width={1512}
            height={785}
            sizes="(max-width: 768px) 100vw, 500px"
            className="w-full h-auto"
          />
        </a>
      </section>

      <div className="flex flex-wrap gap-5">
        <a href="https://placebrokers-frontend.vercel.app" target="_blank" rel="noopener noreferrer" className="link-texto">Abrir o site</a>
        <a href="https://github.com/Arthurms-dev/PI4-Place-Brokers-Integrador-FrontEnd" target="_blank" rel="noopener noreferrer" className="link-texto">Ver o código</a>
        <Link href="/projetos" className="link-texto">Voltar aos projetos</Link>
      </div>

      <p className="text-sm text-[color:var(--tinta-suave)]">
        O servidor gratuito pode levar até um minuto para acordar na primeira visita.
      </p>

      <ProximoComodo
        href="/projetos/cashflow"
        nome="CashFlow"
        resumo="Uma API em C# e .NET e a falha de segurança que eu achei nela."
      />
      <CotaLeitura />
    </Comodo>
  );
}
