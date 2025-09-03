'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useFetch } from '@/hooks/useFetch'

export default function FormPlanPrincipal({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    shouldUnregister: true,
    defaultValues: {
      idPersona: '',
      nombrePlan: '',
      correo: '',
      fechaInicio: '',
      costo: 0,
      direccionPlan: '',
      idMetPago: '',
      idTarjeta: ''
    }
  })

  // Datos para selects
  const { data: { personas, metodosPago, tarjetas }, loading, error, solicitudApi } = useFetch()

  useEffect(() => {
    if (!personas) solicitudApi('persona', 'personas')
    if (!metodosPago) solicitudApi('metodo-pago', 'metodosPago')
    if (!tarjetas) solicitudApi('tarjeta', 'tarjetas')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas, metodosPago, tarjetas])

  useEffect(() => {
    if (selected) {
      reset({
        idPersona: selected.persona?.idpersona || '',
        nombrePlan: selected.nombreplan || '',
        correo: selected.correo || '',
        fechaInicio: selected.fechainicio || '',
        costo: selected.costo ?? 0,
        direccionPlan: selected.direccionplan || '',
        idMetPago: selected.metodopago?.idmetpago || '',
        idTarjeta: selected.tarjeta?.idtarjeta || ''
      })
    } else {
      reset({ idPersona: '', nombrePlan: '', correo: '', fechaInicio: '', costo: 0, direccionPlan: '', idMetPago: '', idTarjeta: '' })
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

  // Registrar plan
  const onSubmitRegistrar = async (values) => {
    if (selected?.idplanp) {
      toast.info('Para registrar uno nuevo, primero deselecciona el plan actual.')
      return
    }
    // Asegurar tipos correctos (costo como number)
    const body = { ...values, costo: Number(values.costo), fechaInicio: toDMY(values.fechaInicio) }
    const res = await apiClient('/plan-principal', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  // Actualizar datos básicos
  const onSubmitBasicos = async (values) => {
    if (!selected?.idplanp) return
    const body = {
      nombrePlan: values.nombrePlan,
      correo: values.correo,
      costo: Number(values.costo),
      direccionPlan: values.direccionPlan
    }
    const res = await apiClient(`/plan-principal/${selected.idplanp}/actualizar`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  // Cambiar estado
  const onToggleEstado = async () => {
    if (!selected?.idplanp) return
    const res = await apiClient(`/plan-principal/${selected.idplanp}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: !selected.estado })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  // Cambiar método de pago
  const onCambiarMetodoPago = async (idMetPago) => {
    if (!selected?.idplanp) return
    const res = await apiClient(`/plan-principal/${selected.idplanp}/metodo-pago`, {
      method: 'PATCH',
      body: JSON.stringify({ idMetPago })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  // Cambiar tarjeta
  const onCambiarTarjeta = async (idTarjeta) => {
    if (!selected?.idplanp) return
    const res = await apiClient(`/plan-principal/${selected.idplanp}/tarjeta`, {
      method: 'PATCH',
      body: JSON.stringify({ idTarjeta })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const handleCancel = () => {
    reset({ idPersona: '', nombrePlan: '', correo: '', fechaInicio: '', costo: 0, direccionPlan: '', idMetPago: '', idTarjeta: '' })
    onCancel?.()
  }

  const parseDate = (str) => {
    if (!str) return null
    if (typeof str === 'string' && str.includes('T')) {
      const dt = new Date(str)
      return isNaN(dt.getTime()) ? null : dt
    }
    if (typeof str === 'string' && str.includes('/')) {
      const [d, m, y] = str.split('/')
      const dt = new Date(Number(y), Number(m) - 1, Number(d))
      return isNaN(dt.getTime()) ? null : dt
    }
    const dt = new Date(str)
    return isNaN(dt.getTime()) ? null : dt
  }
  const fmtDate = (str) => {
    const dt = parseDate(str)
    if (!dt) return '-'
    return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(dt)
  }

  return (
    <form key={selected?.idplanp || 'new'} onSubmit={handleSubmit(onSubmitRegistrar)} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-title font-semibold'>Plan principal</h3>
      </div>

      {selected && (
        <>
          <div className='relative overflow-hidden rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-600/15 via-teal-500/10 to-cyan-500/10 p-4'>
            <div className='absolute right-3 top-3'>
              {selected.estado ? (
                <span className='px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs'>Activo</span>
              ) : (
                <span className='px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs'>Inactivo</span>
              )}
            </div>
            <div className='relative z-10'>
              <p className='text-subtitle text-[11px] uppercase tracking-wide'>Plan principal</p>
              <h4 className='text-title text-lg font-semibold'>{selected.nombreplan}</h4>
              <div className='mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Persona</p>
                  <p className='text-title'>{selected.persona?.nombres} {selected.persona?.apellidos}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Correo</p>
                  <p className='text-title truncate' title={selected.correo}>{selected.correo}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Inicio</p>
                  <p className='text-title'>{fmtDate(selected.fechainicio)}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Próx. pago</p>
                  {(() => {
                    const dt = parseDate(selected.proxpago)
                    if (!dt) return <p className='text-title'>-</p>
                    const today = new Date(); today.setHours(0,0,0,0)
                    const diff = dt.getTime() - today.getTime()
                    const days = Math.ceil(diff / (1000*60*60*24))
                    const style = days < 0
                      ? 'bg-rose-500/20 text-rose-300'
                      : days <= 3
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    return <span className={`px-2 py-0.5 rounded text-xs ${style}`}>{fmtDate(selected.proxpago)}</span>
                  })()}
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Costo</p>
                  <p className='text-title'>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(selected.costo || 0)}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Método</p>
                  <p className='text-title'>{selected.metodopago?.nombre}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2 md:col-span-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Tarjeta</p>
                  <p className='text-title font-mono'>{selected.tarjeta?.numero}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-3 flex gap-2'>
            <Button type='button' onClick={onToggleEstado} text={selected.estado ? 'Desactivar' : 'Activar'} />
            <Button type='button' onClick={handleCancel} text='Cancelar' />
          </div>
        </>
      )}

      {!selected ? (
        <>
          <div className='space-y-2'>
            <label htmlFor='idPersona' className='block text-sm text-subtitle'>Persona Admin</label>
            <select
              id='idPersona'
              className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50'
              {...register('idPersona', { required: true })}
            >
              <option value=''>Seleccione un Admin{loading ? ' (cargando...)' : ''}</option>
              {personas && personas.map((p) => (
                <option key={p.idpersona} value={p.idpersona}>{p.nombres} {p.apellidos}</option>
              ))}
            </select>
            {error && <p className='text-xs text-rose-400'>Error personas: {error}</p>}
            {errors.idPersona && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <TextField id='nombrePlan' label='Nombre del plan' placeholder='Nombre' type='text' message='Campo obligatorio' register={register} errors={errors} />
            <TextField id='correo' label='Correo' placeholder='correo@dominio.com' type='email' message='Correo inválido' register={register} errors={errors} />
            <TextField id='fechaInicio' label='Fecha de inicio' type='date' message='Campo obligatorio' register={register} errors={errors} />
            <TextField id='costo' label='Costo' placeholder='0.00' type='number' message='Campo obligatorio' register={register} errors={errors} />
            <div className='md:col-span-2'>
              <TextField id='direccionPlan' label='Dirección' placeholder='Dirección' type='text' message='Campo obligatorio' register={register} errors={errors} />
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='idMetPago' className='block text-sm text-subtitle'>Método de pago</label>
            <select id='idMetPago' className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' {...register('idMetPago', { required: true })}>
              <option value=''>Seleccione método{loading ? ' (cargando...)' : ''}</option>
              {metodosPago && metodosPago.map((m) => (
                <option key={m.idmetpago} value={m.idmetpago}>{m.nombre}</option>
              ))}
            </select>
            {errors.idMetPago && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
          </div>

          <div className='space-y-2'>
            <label htmlFor='idTarjeta' className='block text-sm text-subtitle'>Tarjeta</label>
            <select id='idTarjeta' className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' {...register('idTarjeta', { required: true })}>
              <option value=''>Seleccione tarjeta{loading ? ' (cargando...)' : ''}</option>
              {tarjetas && tarjetas.map((t) => (
                <option key={t.idtarjeta} value={t.idtarjeta}>{t.numero} - {t.banco}</option>
              ))}
            </select>
            {errors.idTarjeta && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
          </div>

          <div className='flex gap-2'>
            <Button
              type='submit'
              disabled={isSubmitting}
              loading={{ state: isSubmitting, inactive: 'Registrar', active: 'Registrando' }}
            />
            <Button type='button' onClick={handleCancel} text='Cancelar' />
          </div>
        </>
      ) : (
        // Edición cuando hay seleccionado
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <TextField id='nombrePlan' label='Nombre del plan' placeholder='Nombre' type='text' message='Campo obligatorio' register={register} errors={errors} />
            <TextField id='correo' label='Correo' placeholder='correo@dominio.com' type='email' message='Correo inválido' register={register} errors={errors} />
            <TextField id='costo' label='Costo' placeholder='0.00' type='number' message='Campo obligatorio' register={register} errors={errors} />
            <TextField id='direccionPlan' label='Dirección' placeholder='Dirección' type='text' message='Campo obligatorio' register={register} errors={errors} />
          </div>

          <div className='flex gap-2'>
            <Button
              type='button'
              onClick={handleSubmit(onSubmitBasicos)}
              disabled={isSubmitting}
              loading={{ state: isSubmitting, inactive: 'Guardar cambios', active: 'Guardando' }}
            />
            <Button type='button' onClick={handleCancel} text='Cancelar' />
          </div>

          <div className='rounded-md border border-border bg-card p-3 text-sm'>
            <p className='text-title font-semibold'>Cambiar método de pago</p>
            <div className='mt-2 space-y-2'>
              <select className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' defaultValue={selected.metodopago?.idmetpago || ''} onChange={(e) => onCambiarMetodoPago(e.target.value)}>
                <option value=''>Seleccione método{loading ? ' (cargando...)' : ''}</option>
                {metodosPago && metodosPago.map((m) => (
                  <option key={m.idmetpago} value={m.idmetpago}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='rounded-md border border-border bg-card p-3 text-sm'>
            <p className='text-title font-semibold'>Cambiar tarjeta</p>
            <div className='mt-2 space-y-2'>
              <select className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' defaultValue={selected.tarjeta?.idtarjeta || ''} onChange={(e) => onCambiarTarjeta(e.target.value)}>
                <option value=''>Seleccione tarjeta{loading ? ' (cargando...)' : ''}</option>
                {tarjetas && tarjetas.map((t) => (
                  <option key={t.idtarjeta} value={t.idtarjeta}>{t.numero} - {t.banco}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </form>
  )
}
