import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Pago Cupo | Streemo'
}

export default function PagoCupoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Pago Cupo">
      {children}
    </Layout>
  )
}
