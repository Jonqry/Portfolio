import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

// Uma família só: o tamanho óptico separa título de corpo (DESIGN.md, seção 4).
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--fonte-bricolage",
  display: "swap",
});

const descricao =
  "Desenvolvedor em Recife, estudante de Sistemas para Internet na Unicap. Projetos em React, TypeScript, Node.js e C# com .NET.";

export const metadata = {
  metadataBase: new URL("https://joaovictorvarela.vercel.app"),
  title: {
    default: "João Victor Varela | Desenvolvedor",
    template: "%s | João Victor Varela",
  },
  description: descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "João Victor Varela",
    title: "João Victor Varela | Desenvolvedor",
    description: descricao,
    images: [{ url: "/preview-portfolio.jpg", width: 1200, height: 630, alt: "João Victor Varela e a planta do site, com os cômodos que levam a cada seção" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "João Victor Varela | Desenvolvedor",
    description: descricao,
    images: ["/preview-portfolio.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={bricolage.variable}>
      <body className="min-h-screen flex flex-col">
        <a href="#conteudo" className="pular">Pular para o conteúdo</a>
        <Navbar />
        <main id="conteudo" className="flex-grow w-full px-5 sm:px-8 py-10 md:py-14">{children}</main>
        <footer className="border-t-2 border-[color:var(--tinta)] px-5 sm:px-8 py-8">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-[color:var(--tinta-suave)]">
            <p>João Victor Varela, em Recife</p>
            <div className="flex gap-5">
              <a className="hover:text-[color:var(--tinta)]" href="https://www.linkedin.com/in/joaovictorvarela" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="hover:text-[color:var(--tinta)]" href="https://github.com/Jonqry" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="hover:text-[color:var(--tinta)]" href="mailto:joaovictorvarela321@gmail.com">E-mail</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
