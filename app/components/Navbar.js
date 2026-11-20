'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/projetos', label: 'Projetos' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/profissional', label: 'Experiência' },
];

export default function Navbar() {
  const caminho = usePathname();
  return (
    <nav className="nav">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-1 py-3">
        <Link href="/" className="marca text-lg font-extrabold no-underline">
          João Victor Varela
        </Link>
        <div className="flex flex-wrap gap-1 -mx-2 md:mx-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={caminho === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a href="/curriculo-joao-victor-varela.pdf" download className="nav-link">
            Currículo
          </a>
        </div>
      </div>
    </nav>
  );
}
