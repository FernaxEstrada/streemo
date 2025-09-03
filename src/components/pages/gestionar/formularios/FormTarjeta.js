'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useFetch } from '@/hooks/useFetch'

export default function FormTarjeta({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { idPersona: '', numero: '', banco: '', vencimiento: '' }
  })

  // Personas para el selector
  const { data: { personas }, loading, error, solicitudApi } = useFetch()
  useEffect(() => {
    if (!personas) {
      solicitudApi('persona', 'personas')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas])

  useEffect(() => {
    if (selected) {
      reset({
        idPersona: selected.persona?.idpersona || '',
        numero: selected.numero || '',
        banco: selected.banco || '',
        vencimiento: selected.vencimiento || ''
      })
    } else {
      reset({ idPersona: '', numero: '', banco: '', vencimiento: '' })
    }
  }, [selected, reset])

  const onSubmit = async (values) => {
    if (selected && selected.idtarjeta) {
      toast.info('Solo es posible cambiar el estado. Para registrar, deselecciona la tarjeta actual.')
      return
    }
    // POST crear
    const res = await apiClient('/tarjeta', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onToggleEstado = async () => {
    if (!selected?.idtarjeta) return
    const nuevoEstado = !selected.estado
    const res = await apiClient(`/tarjeta/${selected.idtarjeta}/estado`, {
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
        <h3 className='text-title font-semibold'>Tarjeta</h3>
      </div>

      {selected && (
        <div className='relative overflow-hidden rounded-xl p-4 text-white shadow-md'
             style={{ background: 'linear-gradient(135deg, rgba(16,185,129,1) 0%, rgba(20,184,166,1) 100%)' }}>
          <div className='absolute inset-0 pointer-events-none opacity-15'
               style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,.5) 0, rgba(255,255,255,0) 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,.35) 0, rgba(255,255,255,0) 35%)' }} />

          <div className='relative flex items-center justify-between'>
            <div className='w-10 h-7 bg-yellow-300/90 rounded-sm shadow-inner' aria-hidden />
            <span className='text-xs uppercase tracking-wider opacity-90'>{selected.banco || 'Tarjeta'}</span>
          </div>

          <div className='relative mt-6'>
            <p className='text-lg font-mono tracking-wider'>{selected.numero}</p>
          </div>

          <div className='relative mt-6 flex items-end justify-between'>
            <div>
              <p className='text-[10px] uppercase opacity-90'>Titular</p>
              <p className='text-sm font-semibold'>
                {selected.persona ? `${selected.persona.nombres} ${selected.persona.apellidos}` : '—'}
              </p>
            </div>
            <div className='text-right'>
              <p className='text-[10px] uppercase opacity-90'>Vence</p>
              <p className='text-sm font-semibold'>{selected.vencimiento || '—'}</p>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-2'>
        <label htmlFor='idPersona' className='block text-sm text-subtitle'>Persona</label>
        <select
          id='idPersona'
          className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50'
          disabled={!!selected}
          {...register('idPersona', { required: true })}
        >
          <option value=''>Seleccione una persona{loading ? ' (cargando...)' : ''}</option>
          {personas && personas.map((p) => (
            <option key={p.idpersona} value={p.idpersona}>
              {p.nombres} {p.apellidos}
            </option>
          ))}
        </select>
        {error && <p className='text-xs text-rose-400'>No se pudieron cargar las personas: {error}</p>}
        {errors.idPersona && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
      </div>

      <TextField id='numero' label='Número de tarjeta' placeholder='Solo dígitos (13-19)' type='text' message='Campo obligatorio' register={register} errors={errors} readOnly={!!selected} />
      <TextField id='banco' label='Banco' placeholder='Ej. Banco X' type='text' message='Campo obligatorio' register={register} errors={errors} disabled={!!selected} />
      <TextField id='vencimiento' label='Vencimiento (MM/YY)' placeholder='MM/YY' type='text' message='Campo obligatorio' register={register} errors={errors} disabled={!!selected} />

      <div className='flex gap-2'>
        {!selected && (
          <Button
            type='submit'
            disabled={isSubmitting}
            loading={{ state: isSubmitting, inactive: 'Registrar', active: 'Registrando' }}
          />
        )}
        <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
        {selected && (
          <Button type='button' onClick={onToggleEstado} text={selected.estado ? 'Desactivar' : 'Activar'} />
        )}
      </div>
    </form>
  )
}
