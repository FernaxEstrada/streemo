import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Planes de Cupo | Streemo'
}

export default function PlanCupoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Planes de Cupo">
      {children}
    </Layout>
  )
}
