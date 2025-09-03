import Layout from "@/components/layouts/layout"

export const metadata = {
  title: 'Gestionar Usuarios | Streemo'
}

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout title="Gestionar Usuarios">
      {children}
    </Layout>
  )
}
