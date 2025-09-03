import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Tarjetas | Streemo'
}

export default function TarjetasLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Tarjetas">
      {children}
    </Layout>
  )
}
