import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/academico', label: 'Exp. Acadêmica' },
  { href: '/profissional', label: 'Exp. Profissional' },
  { href: '/projetos', label: 'Projetos' },
];

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 md:py-0 md:h-16">
          <div className="flex-shrink-0 font-bold text-xl tracking-wide">
            <Link href="/">João Victor Varela</Link>
          </div>
          <div className="flex flex-wrap gap-1 -mx-3 md:mx-0">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
