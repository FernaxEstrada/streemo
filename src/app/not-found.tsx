import Link from 'next/link'
import Layout from '@/components/layouts/layout'

export default function NotFound() {
  return (
    <Layout title="Página no encontrada">
      <section className='bg-dark font-Inter rounded-md border border-border flex flex-col items-center justify-center h-[400px]'>
        <h1 className='text-title font-bold text-6xl'>404</h1>
        <h1 className='text-title font-semibold text-xl'>Página no encontrada</h1>
        <Link href={'/'}>
          <button className="bg-primary text-title rounded-md font-semibold px-4 py-1.5 my-2 cursor-pointer">
            Volver al Inicio
          </button>
        </Link>
      </section>
    </Layout>
  )
}
