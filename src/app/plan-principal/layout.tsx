import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Plan principal | Streemo'
}

export default function PlanPrincipalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Plan principal">
      {children}
    </Layout>
  )
}
