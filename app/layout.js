import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Currículo | Portfólio",
  description: "Portfólio de desenvolvimento web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-900 text-white text-center py-4 text-sm mt-auto">
          © {new Date().getFullYear()} - Desenvolvido com React e Next.js
        </footer>
      </body>
    </html>
  );
}