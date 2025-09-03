'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'

export default function FormPlanCupo({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { tipoPlan: '', duracionMes: 1, promo: false, precio: 0 }
  })

  useEffect(() => {
    if (selected) {
      reset({
        tipoPlan: selected.tipoplan || '',
        duracionMes: selected.duracionmes ?? 1,
        promo: !!selected.promo,
        precio: selected.precio ?? 0
      })
    } else {
      reset({ tipoPlan: '', duracionMes: 1, promo: false, precio: 0 })
    }
  }, [selected, reset])

  const onSubmit = async (values) => {
    const payload = {
      tipoPlan: values.tipoPlan,
      duracionMes: Number(values.duracionMes),
      promo: !!values.promo,
      precio: Number(values.precio)
    }

    if (selected && selected.idplancupo) {
      const res = await apiClient(`/plan-cupo/${selected.idplancupo}/actualizar`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
      if (res.error) return toast.error(res.msg)
      toast.success(res.msg)
      onSaved?.()
    } else {
      const res = await apiClient('/plan-cupo', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      if (res.error) return toast.error(res.msg)
      toast.success(res.msg)
      onSaved?.()
    }
  }

  const onToggleEstado = async () => {
    if (!selected?.idplancupo) return
    const nuevoEstado = !selected.estado
    const res = await apiClient(`/plan-cupo/${selected.idplancupo}/estado`, {
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
        <h3 className='text-title font-semibold'>Plan de cupo</h3>
      </div>

      <TextField id='tipoPlan' label='Tipo de plan' placeholder='Ej. Básico, Premium' type='text' message='Campo obligatorio' register={register} errors={errors} />

      <TextField id='duracionMes' label='Duración (meses)' placeholder='Ej. 6' type='number' message='Campo obligatorio' register={register} errors={errors} />

      <div className='space-y-1'>
        <label htmlFor='promo' className='text-sm text-label'>¿Es promoción?</label>
        <input id='promo' type='checkbox' className='accent-primary' {...register('promo')} />
      </div>

      <TextField id='precio' label='Precio' placeholder='Ej. 99.99' type='number' step='0.01' message='Campo obligatorio' register={register} errors={errors} />

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
