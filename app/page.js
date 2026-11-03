import Link from 'next/link';
import Image from 'next/image';
import Perfil from '../public/perfil.jpeg';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] animate-fade-in-up">
      
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-12 px-4">
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight">
            Olá, eu sou o <br />
            <span className="text-blue-600 relative inline-block">
              João Victor
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-200 rounded"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
            Desenvolvedor front-end em Recife, focado em React e TypeScript. Também sou corretor de imóveis, e uso essa vivência para criar sistemas que fazem sentido para quem vai usar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center md:justify-start">
            <Link 
              href="/projetos" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300 text-center"
            >
              Ver Meus Projetos
            </Link>
            <a
              href="https://www.linkedin.com/in/joaovictorvarela"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-center"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Jonqry"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-center"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="flex-shrink-0 relative">
          
          <div className="absolute -inset-2 bg-blue-100 rounded-full blur-2xl opacity-70"></div>
          
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
            <Image 
              src= {Perfil}
              alt="Foto de perfil de João Victor"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 256px, 320px"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
