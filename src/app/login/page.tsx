import Logo from '@/components/illustations/Logo'
import FormLogin from '@/components/pages/login/FormLogin'

export default function LoginPage() {
  return (
    <section className="flex w-full h-screen items-center justify-center p-5">
      <div className="w-[400px] px-8 py-16 bg-dark rounded-xl border-t-primary border-t-4 border-border">
        <div className="flex px-6 flex-col items-center justify-center">
          <Logo width={200} height={232} isWhite altura={'w-full'} />
          <h1 className="text-title text-center py-4 text-xl font-semibold">Inicia sesión</h1>
        </div>
        <FormLogin />
      </div>
    </section>
  )
}
