import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl tracking-wider">
            <Link href="/">Portfólio</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link href="/sobre" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Sobre</Link>
              <Link href="/academico" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Exp. Acadêmica</Link>
              <Link href="/profissional" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Exp. Profissional</Link>
              <Link href="/projetos" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">Projetos</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}