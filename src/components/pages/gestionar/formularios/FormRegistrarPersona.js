'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'

export default function FormRegistrarPersona({ formExit }) {

  const [isLoading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (persona) => {
    setLoading(true)
    const { error, msg } = await apiClient("/persona", {
      method: "POST",
      body: JSON.stringify({
        ...persona,
        tipoAP: false,
        tipoC: true,
        tipoSA: false
      })
    })
    if (error) {
      toast.error(msg)
    } else {
      toast.success(msg)
      formExit(true);
    }
    setLoading(false)
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
      <TextField
        disabled={isLoading}
        id='nombres'
        label='Nombres'
        placeholder='Nombres'
        type='text'
        message='Campo obligatorio'
        register={register}
        errors={errors} />

      <TextField
        disabled={isLoading}
        id='apellidos'
        label='Apellidos'
        placeholder='Apellidos'
        type='text'
        message='Campo obligatorio'
        register={register}
        errors={errors} />

      <div className='flex gap-2'>
        <TextField
          disabled={isLoading}
          id='telefono'
          label='Telefono'
          placeholder='Telefono'
          type='text'
          message='Campo obligatorio'
          register={register}
          errors={errors} />

        <TextField
          disabled={isLoading}
          id='sexo'
          label='Sexo'
          placeholder='Sexo'
          type='text'
          message='Campo obligatorio'
          register={register}
          errors={errors} />

      </div>

      <Button
        type="submit"
        disabled={isLoading}
        loading={{ state: isLoading, inactive: 'Registrar persona', active: 'Registrando persona' }}
      />
    </form>
  )
}
