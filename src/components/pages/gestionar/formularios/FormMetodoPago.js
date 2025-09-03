'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'

export default function FormMetodoPago({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { nombre: '' }
  })

  useEffect(() => {
    if (selected) {
      reset({ nombre: selected.nombre || '' })
    } else {
      reset({ nombre: '' })
    }
  }, [selected, reset])

  const onSubmit = async (values) => {
    if (selected && selected.idmetpago) {
      const res = await apiClient(`/metodo-pago/${selected.idmetpago}/nombre`, {
        method: 'PATCH',
        body: JSON.stringify(values)
      })
      if (res.error) return toast.error(res.msg)
      toast.success(res.msg)
      onSaved?.()
    } else {
      const res = await apiClient('/metodo-pago', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      if (res.error) return toast.error(res.msg)
      toast.success(res.msg)
      onSaved?.()
    }
  }

  const onToggleEstado = async () => {
    if (!selected?.idmetpago) return
    const nuevoEstado = !selected.estado
    const res = await apiClient(`/metodo-pago/${selected.idmetpago}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-title font-semibold'>Método de pago</h3>
      </div>

      <TextField id='nombre' label='Nombre' placeholder='Ej. Tarjeta, Efectivo, Transferencia' type='text' message='Campo obligatorio' register={register} errors={errors} />

      <div className='flex gap-2'>
        <Button
          type='submit'
          disabled={isSubmitting}
          loading={{ state: isSubmitting, inactive: selected ? 'Guardar cambios' : 'Registrar', active: selected ? 'Guardando' : 'Registrando' }}
        />
        <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
        {selected && (
          <Button type='button' onClick={onToggleEstado} text={selected.estado ? 'Desactivar' : 'Activar'} />
        )}
      </div>
    </form>
  )
}
