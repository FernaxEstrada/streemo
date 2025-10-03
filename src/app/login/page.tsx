import Logo from '@/components/illustations/Logo'
import FormLogin from '@/components/pages/login/FormLogin'

export default function LoginPage() {
  return (
    <section className="flex w-full h-screen items-center justify-center p-5">
      <div className="w-[400px] px-8 py-16 bg-dark rounded-xl border-t-primary border-t-4 border-border">
        <div className="flex px-6 flex-col items-center justify-center">
          <div className='flex h-12'>
            <Logo width={571} height={142} isWhite />
          </div>
          <h1 className="text-title text-center py-4 text-xl font-semibold">Inicia sesión</h1>
        </div>
        <FormLogin />
      </div>
    </section>
  )
}
