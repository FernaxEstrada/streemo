import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Personas | Streemo'
}

export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Personas">
      {children}
    </Layout>
  )
}
