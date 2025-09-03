import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Cupo Vendido | Streemo'
}

export default function CupoVendidoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Cupo Vendido">
      {children}
    </Layout>
  )
}
