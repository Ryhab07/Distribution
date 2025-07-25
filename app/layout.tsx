import React from 'react';
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from './providers';

const poppins = Poppins({
  weight: ["900", "800", "700", "600", "500", "400", "300"],   
  display: "swap",
  subsets: ["latin"],
  variable: "--poppins-font",
});

export const metadata: Metadata = {
  title: "Larna",
  description: "Votre partenaire professionnel pour des solutions photovoltaïques performantes",
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
  return (
    <Providers>
      <html lang="fr">
        <body className={poppins.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
