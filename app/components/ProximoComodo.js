import Link from 'next/link';

// Fim de um estudo de caso: em vez de só voltar, leva ao próximo projeto.
export default function ProximoComodo({ href, nome, resumo }) {
  return (
    <nav className="bloco" aria-label="Próximo estudo de caso">
      <p className="text-sm text-[color:var(--tinta-suave)] mb-1">Próximo cômodo</p>
      <Link href={href} className="proximo-link text-2xl font-extrabold">
        {nome} <span aria-hidden="true">→</span>
      </Link>
      <p className="text-[color:var(--tinta-suave)] mt-1">{resumo}</p>
    </nav>
  );
}
