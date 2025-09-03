import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import PrivateRoute from "@/components/PrivateRoute"

export default function Layout({ children, title }) {
  return (
    <PrivateRoute>
      <main className="flex flex-col pl-[220px] pt-18 items-center justify-center">
        <Sidebar />
        <Header title={title} />
        <section className="w-full grid grid-cols-12 gap-4 min-h-96 relative py-10 px-6">
          <div className="col-span-12">
            {children}
          </div>
        </section>
      </main>
    </PrivateRoute>
  )
}