import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Métodos de Pago | Streemo'
}

export default function MetodoPagoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Métodos de Pago">
      {children}
    </Layout>
  )
}
