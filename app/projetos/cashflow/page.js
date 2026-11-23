import Link from 'next/link';
import Comodo from '../../components/Comodo';
import CotaLeitura from '../../components/CotaLeitura';
import Ficha from '../../components/Ficha';
import ProximoComodo from '../../components/ProximoComodo';

export const metadata = {
  title: 'CashFlow: estudo de caso',
  description:
    'Controle de gastos da casa em C# com .NET e React, e a segurança que apliquei na API seguindo o OWASP API Security Top 10.',
};

const tecnologias = ['C# e .NET 10', 'ASP.NET Core', 'Entity Framework Core', 'SQLite', 'React', 'TypeScript', 'xUnit', 'GitHub Actions'];

const controles = [
  {
    titulo: 'Login com JWT',
    texto:
      'Toda rota exige token, menos as de login e cadastro. A API só aceita token com a assinatura, o emissor, o público e a validade certos. Os testes tentam token vencido, assinado com outra chave, com o conteúdo alterado e com alg: none, e todos recebem 401.',
  },
  {
    titulo: 'Senha só como hash',
    texto:
      'A senha é guardada como hash PBKDF2. No login, e-mail que não existe e senha errada recebem a mesma resposta, para ninguém descobrir quais e-mails têm conta.',
  },
  {
    titulo: 'A falha de mass assignment',
    texto:
      'O cadastro de pessoa recebia a entidade inteira. Dava para cadastrar um menor de idade já com receitas na mesma requisição, passando por cima da regra de idade. Agora a API só aceita nome e idade, e um teste garante que a falha não volta.',
  },
  {
    titulo: 'Limite de tentativas e headers',
    texto:
      'Login e cadastro aceitam 5 tentativas por minuto por IP, e o resto da API, 100. Passou disso, a resposta é 429. Todas as respostas, inclusive as de erro, levam os headers de segurança, e os erros não mostram stack trace.',
  },
];

const numeros = [
  { valor: 4, rotulo: 'ataques ao token testados, e todos recebem 401' },
  { valor: 5, rotulo: 'tentativas de login por minuto, por IP' },
  { valor: 1, rotulo: 'falha de mass assignment achada e fechada' },
];

const aprendizados = [
  'Regra de negócio que a API não protege é só sugestão. A regra de idade existia, mas o cadastro aceitava a entidade inteira e passava por cima dela.',
  'Controle de segurança também precisa de teste. Cada um tem um teste que tenta quebrá-lo, então uma mudança futura não abre a mesma falha de novo.',
];

export default function CashFlow() {
  return (
    <Comodo piso="ceramica" className="space-y-10">
      <header>
        <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Estudo de caso</p>
        <h1 className="titulo-pagina">CashFlow</h1>
        <p className="intro-pagina">
          Um controle de gastos da casa, com API em C# e .NET, que depois eu usei para estudar segurança de APIs.
        </p>
        <div className="cota-linha" aria-hidden="true" />
      </header>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">O sistema</h2>
        <div className="space-y-3 max-w-3xl text-[color:var(--tinta-suave)]">
          <p>
            O CashFlow cadastra as pessoas da família, registra as receitas e as despesas de cada uma e mostra
            o total por pessoa e o geral.
          </p>
          <p>
            As regras de negócio ficam na API, e não na tela. Menor de 18 anos não pode lançar receita: a API
            recusa com 400, então a regra vale mesmo para quem chama a API direto. Ao excluir uma pessoa, as
            transações dela saem junto, para nenhuma ficar sem dono.
          </p>
        </div>
      </section>

      <figure className="max-w-3xl">
        <video
          className="imagem-projeto w-full h-auto"
          src="/projetos/cashflow-uso.mp4"
          poster="/projetos/cashflow-uso.jpg"
          width={942}
          height={576}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
        <figcaption className="text-sm text-[color:var(--tinta-suave)] mt-2">
          A regra de idade funcionando: o Lucas tem menos de 18 anos, e a API bloqueia a receita que ele tenta lançar.
        </figcaption>
      </figure>

      <Ficha itens={numeros} />

      <section>
        <h2 className="text-2xl font-bold mb-2">A segurança da API</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">
          Usei o OWASP API Security Top 10 como guia, e os controles principais têm testes de integração.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {controles.map((c) => (
            <article key={c.titulo} className="bloco">
              <h3 className="text-xl font-semibold mb-2">{c.titulo}</h3>
              <p className="text-[color:var(--tinta-suave)]">{c.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">Como eu testo</h2>
        <p className="text-[color:var(--tinta-suave)] mb-4 max-w-3xl">
          Os testes sobem a API inteira com o WebApplicationFactory, contra um banco SQLite temporário, e
          rodam no GitHub Actions a cada push. A chave do JWT não fica no repositório: em produção, a API nem
          inicia sem ela.
        </p>
        <ul className="flex flex-wrap gap-x-2 gap-y-1">
          {tecnologias.map((tec) => (
            <li key={tec} className="etiqueta">{tec}</li>
          ))}
        </ul>
      </section>

      <section className="bloco">
        <h2 className="text-2xl font-bold mb-3">O que eu aprendi</h2>
        <ul className="space-y-2 max-w-3xl list-disc pl-5 text-[color:var(--tinta-suave)]">
          {aprendizados.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-5">
        <a href="https://github.com/Jonqry/cashflow-fullstack" target="_blank" rel="noopener noreferrer" className="link-texto">Ver o código</a>
        <Link href="/projetos" className="link-texto">Voltar aos projetos</Link>
      </div>

      <ProximoComodo
        href="/projetos/simulador"
        nome="Simulador de Financiamento"
        resumo="O simulador que eu uso no plantão, com mais de 390 testes."
      />
      <CotaLeitura />
    </Comodo>
  );
}
