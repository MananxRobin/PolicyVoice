import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Public Comment Drafter — Regulations.gov",
  description:
    "Draft and submit substantive public comments on federal regulations. Exercise power most Americans don't know they have under the Administrative Procedure Act.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RG</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-navy-900 leading-tight">
                    Public Comment Drafter
                  </h1>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Powered by the Administrative Procedure Act
                  </p>
                </div>
              </div>
              <a
                href="https://www.regulations.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-navy-600 transition-colors"
              >
                regulations.gov
              </a>
            </div>
          </header>
          <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-4">
            <div className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-400">
              Built for civic empowerment. Not affiliated with the U.S.
              government. Comments are submitted via the public Regulations.gov API.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
