import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pescaria Três Marias 2027",
  description: "Controle financeiro e logística da expedição de pesca – Pousada do Júnior, Lago de Três Marias/MG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}