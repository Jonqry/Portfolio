import Link from 'next/link';

// Página interna como um cômodo da planta (DESIGN.md, seção 8).
// piso: o token do piso do cômodo (porcelanato, taco, ceramica...).
export default function Comodo({ piso = 'porcelanato', className = '', children }) {
  return (
    <div className="comodo-pagina" style={{ '--piso-comodo': `var(--${piso})` }}>
      <Link href="/" className="porta-saida">
        <svg className="porta-simbolo" viewBox="0 0 48 48" aria-hidden="true">
          <path className="porta-arco" d="M0 0 A48 48 0 0 1 48 48" />
          <path className="porta-folha" d="M0 48 V0" />
        </svg>
        Voltar à planta
      </Link>
      <div className={`pagina ${className}`}>{children}</div>
    </div>
  );
}
