import Link from 'next/link';
import Comodo from './components/Comodo';

export const metadata = {
  title: 'Cômodo não encontrado',
};

// Página de erro 404 no mesmo formato das páginas internas: um cômodo com a porta de volta à planta.
export default function NaoEncontrado() {
  return (
    <Comodo piso="porcelanato" className="space-y-6">
      <header>
        <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Erro 404</p>
        <h1 className="titulo-pagina">Esse cômodo não está na planta</h1>
        <p className="intro-pagina">
          O endereço pode ter mudado, ou o link veio com algum erro de digitação.
        </p>
        <div className="cota-linha" aria-hidden="true" />
      </header>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="botao botao-principal">Voltar à planta</Link>
        <Link href="/projetos" className="botao botao-linha">Ver projetos</Link>
        <Link href="/sobre" className="botao botao-linha">Sobre mim</Link>
      </div>
    </Comodo>
  );
}
