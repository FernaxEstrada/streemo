import type { Metadata } from "next";
import { Inter, Manrope } from 'next/font/google'
import "@/styles/globals.css";
import IsToaster from '@/components/IsToaster'
import { AuthProvider } from "@/context/AuthContext"
import { DataProvider } from "@/context/DataContext"

const inter = Inter({
  weight: ['600', '700'],
  subsets: ['latin']
})

const manrope = Manrope({
  weight: ['400', '600', '700'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Streemo",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${manrope.className} antialiased`}>
        <AuthProvider>
          <DataProvider>
            {children}
            <IsToaster />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
