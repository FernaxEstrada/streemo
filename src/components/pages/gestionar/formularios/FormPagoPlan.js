'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useFetch } from '@/hooks/useFetch'

export default function FormPagoPlan({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    shouldUnregister: true,
    defaultValues: { idPlanP: '', fechaPago: '', nota: '', estado: true }
  })
  
  const estado = watch('estado', true)

  const { data: { planes }, loading, error, solicitudApi } = useFetch()

  useEffect(() => {
    if (!planes) solicitudApi('plan-principal', 'planes')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planes])

  useEffect(() => {
    if (!selected) {
      reset({ idPlanP: '', fechaPago: '', nota: '' })
    } else {
      // edición: solo nota
      reset({ idPlanP: selected.idplanp || '', fechaPago: '', nota: selected.nota || '' })
    }
  }, [selected, reset])

  const toDMY = (s) => {
    if (!s) return s
    const parts = String(s).split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
    const dt = new Date(s)
    if (isNaN(dt.getTime())) return s
    const dd = String(dt.getDate()).padStart(2, '0')
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const yy = dt.getFullYear()
    return `${dd}/${mm}/${yy}`
  }

  const onSubmitCrear = async (values) => {
    if (selected?.idpagoplan) {
      toast.info('Para registrar un nuevo pago, deselecciona el pago actual.')
      return
    }
    const body = { 
      idPlanP: values.idPlanP, 
      fechaPago: toDMY(values.fechaPago), 
      nota: values.nota || undefined,
      estado: values.estado
    }
    const res = await apiClient('/pago-plan', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onActualizarNota = async (values) => {
    if (!selected?.idpagoplan || values.nota === selected.nota) {
      toast.info('No hay cambios en la nota')
      return
    }
    
    const res = await apiClient(`/pago-plan/${selected.idpagoplan}/nota`, {
      method: 'PATCH',
      body: JSON.stringify({ idPagoPlan: selected.idpagoplan, nota: values.nota })
    })
    
    if (res.error) return toast.error(res.msg)
    toast.success('Nota actualizada correctamente')
    onSaved?.()
  }
  
  const onActualizarEstado = async (nuevoEstado) => {
    if (!selected?.idpagoplan || nuevoEstado === selected.estado) {
      return
    }
    
    const res = await apiClient(`/pago-plan/${selected.idpagoplan}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ idPagoPlan: selected.idpagoplan, estado: nuevoEstado })
    })
    
    if (res.error) return toast.error(res.msg)
    toast.success(`Pago marcado como ${nuevoEstado ? 'Completado' : 'Cancelado'}`)
    onSaved?.()
  }

  const renderResumen = () => {
    if (!selected) return null

    const formatDate = (dateStr) => {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }

    return (
      <div className='relative overflow-hidden rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600/15 via-teal-500/10 to-cyan-500/10 p-4'>
        <div className='absolute right-3 top-3'>
          {selected.estado ? (
            <span className='px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs'>Completado</span>
          ) : (
            <span className='px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs'>Cancelado</span>
          )}
        </div>
        <div className='relative z-10'>
          <p className='text-subtitle text-[11px] uppercase tracking-wide'>Pago de Plan</p>
          <h4 className='text-title text-lg font-semibold'>{selected.nombreplan}</h4>
          <div className='mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Admin</p>
              <p className='text-title'>{selected.persona?.nombres} {selected.persona?.apellidos}</p>
            </div>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Monto</p>
              <p className='text-title font-semibold'>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(selected.monto || 0)}</p>
            </div>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Facturación</p>
              <p className='text-title'>{formatDate(selected.fechafacturacion)}</p>
            </div>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Pagado el</p>
              <p className='text-title'>{formatDate(selected.fechapago)}</p>
            </div>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Método</p>
              <p className='text-title'>{selected.metodopago}</p>
            </div>
            <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Tarjeta</p>
              <p className='text-title font-mono'>{selected.tarjeta}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(selected ? onActualizarNota : onSubmitCrear)} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-title font-semibold'>{selected ? 'Detalles del pago' : 'Nuevo pago'}</h3>
      </div>

      {selected ? renderResumen() : (
        <div className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='idPlanP' className='block text-sm text-subtitle'>Plan</label>
            <select 
              id='idPlanP' 
              className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' 
              {...register('idPlanP', { required: true })}
            >
              <option value=''>Seleccione un plan{loading ? ' (cargando...)' : ''}</option>
              {planes && planes.map((p) => (
                <option key={p.idplanp} value={p.idplanp}>
                  {p.nombreplan} — {p.persona?.nombres} {p.persona?.apellidos}
                </option>
              ))}
            </select>
            {error && <p className='text-xs text-rose-400'>Error cargando planes: {error}</p>}
            {errors.idPlanP && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
          </div>

          <TextField 
            id='fechaPago' 
            label='Fecha de pago' 
            type='date' 
            message='Campo obligatorio' 
            register={register} 
            errors={errors} 
          />

          <div className='space-y-1'>
            <label className='block text-subtitle text-sm' htmlFor='nota'>Nota (opcional)</label>
            <textarea 
              id='nota' 
              className='w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5' 
              placeholder='Comentario interno' 
              {...register('nota')} 
            />
          </div>

          <div className='flex items-center space-x-4'>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                className='form-radio text-primary border-border focus:ring-primary/50'
                value={true}
                checked={estado === true}
                onChange={() => reset({ ...watch(), estado: true })}
              />
              <span className='ml-2 text-sm text-title'>Completado</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                className='form-radio text-rose-500 border-border focus:ring-rose-500/50'
                value={false}
                checked={estado === false}
                onChange={() => reset({ ...watch(), estado: false })}
              />
              <span className='ml-2 text-sm text-title'>Cancelado</span>
            </label>
          </div>

          <div className='flex gap-2'>
            <Button 
              type='submit' 
              disabled={isSubmitting} 
              loading={{ state: isSubmitting, inactive: 'Registrar pago', active: 'Registrando...' }} 
            />
            <Button 
              type='button' 
              onClick={() => onCancel?.()} 
              text='Cancelar' 
              variant='secondary' 
            />
          </div>
        </div>
      )}
      
      {selected && (
        <div className='space-y-4'>
          <div className='space-y-1'>
            <label className='block text-subtitle text-sm' htmlFor='nota'>Nota (opcional)</label>
            <textarea 
              id='nota' 
              className='w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5' 
              placeholder='Comentario interno' 
              {...register('nota')} 
            />
          </div>
          
          <div className='space-y-2'>
            <p className='block text-subtitle text-sm'>Cambiar estado</p>
            <div className='flex items-center space-x-4'>
              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='radio'
                  className='form-radio text-primary border-border focus:ring-primary/50'
                  name='estadoPago'
                  checked={selected.estado === true}
                  onChange={() => onActualizarEstado(true)}
                />
                <span className='ml-2 text-sm text-title'>Completado</span>
              </label>
              <label className='inline-flex items-center cursor-pointer'>
                <input
                  type='radio'
                  className='form-radio text-rose-500 border-border focus:ring-rose-500/50'
                  name='estadoPago'
                  checked={selected.estado === false}
                  onChange={() => onActualizarEstado(false)}
                />
                <span className='ml-2 text-sm text-title'>Cancelado</span>
              </label>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              type='submit'
              disabled={isSubmitting}
              loading={{ state: isSubmitting, inactive: 'Guardar Nota', active: 'Guardando...' }}
            />
            <Button type='button' onClick={onCancel} text='Cancelar' />
          </div>
        </div>
      )}
    </form>
  )
}
