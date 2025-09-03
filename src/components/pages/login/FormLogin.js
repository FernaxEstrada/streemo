'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import TextField from '@/components/TextField'
import PasswordField from '@/components/PasswordField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useAuth } from '@/context/AuthContext'

export default function FormLogin() {

  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (usuario) => {
    setLoading(true)
    const { error, msg, data } = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(usuario)
    })
    if (error) {
      toast.error(msg)
    } else {
      toast.success(msg)
      login(data);
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
      <TextField
        disabled={isLoading}
        id='usuario'
        label='Usuario'
        placeholder='Usuario'
        type='text'
        message='Campo obligatorio'
        register={register}
        errors={errors} />

      <PasswordField
        disabled={isLoading}
        id='contrasena'
        label='Contraseña'
        register={register}
        errors={errors}
      />

      <Button
        type="submit"
        disabled={isLoading}
        loading={{ state: isLoading, inactive: 'Iniciar Sesión', active: 'Iniciando Sesión' }}
      />
    </form>
  )
}
