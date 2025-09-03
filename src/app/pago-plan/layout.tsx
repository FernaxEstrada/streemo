import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Pagos de planes | Streemo'
}

export default function PagoPlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Pagos de planes">
      {children}
    </Layout>
  )
}
