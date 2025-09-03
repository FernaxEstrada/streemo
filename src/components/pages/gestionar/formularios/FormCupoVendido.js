'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/Button'
import { useFetch } from '@/hooks/useFetch'
import { apiClient } from '@/lib/apiClient'

export default function FormCupoVendido({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    defaultValues: { idPersona: '', idPlanP: '', idPlanCupo: '', idMetPago: '', usuario: '', fechaInicio: '', nota: '' }
  })

  const { data: { personas, planes, planesCupo, metodosPago }, solicitudApi } = useFetch()

  useEffect(() => {
    if (!personas) solicitudApi('persona', 'personas')
    if (!planes) solicitudApi('plan-principal', 'planes')
    if (!planesCupo) solicitudApi('plan-cupo', 'planesCupo')
    if (!metodosPago) solicitudApi('metodo-pago', 'metodosPago')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas, planes, planesCupo, metodosPago])

  useEffect(() => {
    if (selected) {
      reset({
        idPersona: selected.persona?.idpersona || '',
        idPlanP: selected.planprincipal?.idplanp || '',
        idPlanCupo: selected.plancupo?.idplancupo || '',
        idMetPago: selected.metodopago?.idmetpago || '',
        usuario: selected.usuario || '',
        fechaInicio: selected.fechainicio || '',
        nota: selected.nota || ''
      })
    } else {
      reset({ idPersona: '', idPlanP: '', idPlanCupo: '', idMetPago: '', usuario: '', fechaInicio: '', nota: '' })
    }
  }, [selected, reset])

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

  const onSubmit = async (values) => {
    const toApiDate = (str) => {
      if (!str) return ''
      // HTML input type=date produce YYYY-MM-DD; API requiere DD/MM/YYYY
      if (typeof str === 'string' && str.includes('-')) {
        const [y, m, d] = str.split('-')
        return `${d}/${m}/${y}`
      }
      // Si ya viene con '/': asumir que está en formato correcto
      return str
    }

    if (selected && selected.idcupo) {
      // Solo actualiza datos basicos (usuario, nota)
      const res = await apiClient(`/cupo-vendido/${selected.idcupo}/actualizar`, {
        method: 'PUT',
        body: JSON.stringify({ usuario: values.usuario, nota: values.nota || undefined })
      })
      if (res.error) return toast.error(res.msg)
      toast.success(res.msg)
      onSaved?.()
      return
    }

    // Crear nuevo cupo vendido
    const payload = {
      idPersona: values.idPersona,
      idPlanP: values.idPlanP,
      idPlanCupo: values.idPlanCupo,
      idMetPago: values.idMetPago,
      usuario: values.usuario,
      fechaInicio: toApiDate(values.fechaInicio),
      nota: values.nota || undefined
    }

    const res = await apiClient('/cupo-vendido', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onToggleEstado = async () => {
    if (!selected?.idcupo) return
    const nuevoEstado = !selected.estado
    const res = await apiClient(`/cupo-vendido/${selected.idcupo}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onChangeMetodo = async () => {
    if (!selected?.idcupo) return
    const res = await apiClient(`/cupo-vendido/${selected.idcupo}/metodo-pago`, {
      method: 'PATCH',
      body: JSON.stringify({ idMetPago: watch('idMetPago') })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onChangePlanCupo = async () => {
    if (!selected?.idcupo) return
    const res = await apiClient(`/cupo-vendido/${selected.idcupo}/plan`, {
      method: 'PATCH',
      body: JSON.stringify({ idPlanCupo: watch('idPlanCupo') })
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-title font-semibold'>Cupo vendido</h3>
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
              <p className='text-subtitle text-[11px] uppercase tracking-wide'>Cupo vendido</p>
              <h4 className='text-title text-lg font-semibold'>{selected.persona?.nombres} {selected.persona?.apellidos}</h4>
              <p className='mt-0.5 text-[11px] text-subtitle'>Tel: {selected.persona?.telefono || '-'}</p>
              <div className='mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Plan principal</p>
                  <p className='text-title'>{selected.planprincipal?.nombreplan}</p>
                  {selected.planprincipal?.correo && (
                    <p className='text-[11px] text-subtitle truncate' title={selected.planprincipal?.correo}>{selected.planprincipal?.correo}</p>
                  )}
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Plan de cupo</p>
                  <p className='text-title'>{selected.plancupo?.tipoplan}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Precio</p>
                  <p className='text-title'>
                    {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(selected.plancupo?.precio || 0))}
                  </p>
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
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Método</p>
                  <p className='text-title'>{selected.metodopago?.nombre}</p>
                </div>
                <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2 md:col-span-2'>
                  <p className='text-[11px] text-subtitle uppercase tracking-wide'>Usuario</p>
                  <p className='text-title'>{selected.usuario}</p>
                </div>
                {selected.nota && (
                  <div className='rounded-md border border-emerald-400/20 bg-dark/30 p-2 md:col-span-2'>
                    <p className='text-[11px] text-subtitle uppercase tracking-wide'>Nota</p>
                    <p className='text-title'>{selected.nota}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='mt-3 flex gap-2'>
            <Button type='button' onClick={onToggleEstado} text={selected.estado ? 'Desactivar' : 'Activar'} />
            <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
          </div>
        </>
      )}

      {!selected ? (
        // Registro
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='idPersona'>Cliente</label>
              <select id='idPersona' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' {...register('idPersona', { required: { value: true, message: 'Campo obligatorio' } })}>
                <option value=''>Seleccione</option>
                {personas && personas.map(p => (
                  <option key={p.idpersona} value={p.idpersona}>{p.nombres} {p.apellidos}</option>
                ))}
              </select>
              <p className={`text-sm text-error ${errors.idPersona?.message ? 'visible' : 'invisible'}`}>{errors.idPersona?.message || 'sin observacion'}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='idPlanP'>Plan principal</label>
              <select id='idPlanP' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' {...register('idPlanP', { required: { value: true, message: 'Campo obligatorio' } })}>
                <option value=''>Seleccione</option>
                {planes && planes.map(pl => (
                  <option key={pl.idplanp} value={pl.idplanp}>{pl.nombreplan}</option>
                ))}
              </select>
              <p className={`text-sm text-error ${errors.idPlanP?.message ? 'visible' : 'invisible'}`}>{errors.idPlanP?.message || 'sin observacion'}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='idPlanCupo'>Plan de cupo</label>
              <select id='idPlanCupo' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' {...register('idPlanCupo', { required: { value: true, message: 'Campo obligatorio' } })}>
                <option value=''>Seleccione</option>
                {planesCupo && planesCupo.map(pc => (
                  <option key={pc.idplancupo} value={pc.idplancupo}>{pc.tipoplan} ({pc.duracionmes}m)</option>
                ))}
              </select>
              <p className={`text-sm text-error ${errors.idPlanCupo?.message ? 'visible' : 'invisible'}`}>{errors.idPlanCupo?.message || 'sin observacion'}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='idMetPago'>Método de pago</label>
              <select id='idMetPago' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' {...register('idMetPago', { required: { value: true, message: 'Campo obligatorio' } })}>
                <option value=''>Seleccione</option>
                {metodosPago && metodosPago.map(mp => (
                  <option key={mp.idmetpago} value={mp.idmetpago}>{mp.nombre}</option>
                ))}
              </select>
              <p className={`text-sm text-error ${errors.idMetPago?.message ? 'visible' : 'invisible'}`}>{errors.idMetPago?.message || 'sin observacion'}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='usuario'>Usuario</label>
              <input id='usuario' type='text' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' placeholder='Usuario responsable' {...register('usuario', { required: { value: true, message: 'Campo obligatorio' } })} />
              <p className={`text-sm text-error ${errors.usuario?.message ? 'visible' : 'invisible'}`}>{errors.usuario?.message || 'sin observacion'}</p>
            </div>

            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='fechaInicio'>Fecha de inicio</label>
              <input id='fechaInicio' type='date' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' {...register('fechaInicio', { required: { value: true, message: 'Campo obligatorio' } })} />
              <p className={`text-sm text-error ${errors.fechaInicio?.message ? 'visible' : 'invisible'}`}>{errors.fechaInicio?.message || 'sin observacion'}</p>
            </div>

            <div className='md:col-span-2 space-y-1'>
              <label className='text-sm text-label' htmlFor='nota'>Nota</label>
              <textarea id='nota' rows={3} className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' placeholder='Opcional' {...register('nota')} />
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              type='submit'
              disabled={isSubmitting}
              loading={{ state: isSubmitting, inactive: 'Registrar', active: 'Registrando' }}
            />
            <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
          </div>
        </>
      ) : (
        // Edición
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <label className='text-sm text-label' htmlFor='usuario'>Usuario</label>
              <input id='usuario' type='text' className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' placeholder='Usuario responsable' {...register('usuario', { required: { value: true, message: 'Campo obligatorio' } })} />
              <p className={`text-sm text-error ${errors.usuario?.message ? 'visible' : 'invisible'}`}>{errors.usuario?.message || 'sin observacion'}</p>
            </div>
            <div className='md:col-span-2 space-y-1'>
              <label className='text-sm text-label' htmlFor='nota'>Nota</label>
              <textarea id='nota' rows={3} className='w-full rounded-md bg-card border border-border text-sm px-4 py-2.5' placeholder='Opcional' {...register('nota')} />
            </div>
          </div>

          <div className='rounded-md border border-border bg-card p-3 text-sm'>
            <p className='text-title font-semibold'>Cambiar método de pago</p>
            <div className='mt-2 space-y-2'>
              <select className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' defaultValue={selected.metodopago?.idmetpago || ''} onChange={(e) => {
                reset({ ...watch(), idMetPago: e.target.value })
                onChangeMetodo()
              }}>
                <option value=''>Seleccione método</option>
                {metodosPago && metodosPago.map((m) => (
                  <option key={m.idmetpago} value={m.idmetpago}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='rounded-md border border-border bg-card p-3 text-sm'>
            <p className='text-title font-semibold'>Cambiar plan de cupo</p>
            <div className='mt-2 space-y-2'>
              <select className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50' defaultValue={selected.plancupo?.idplancupo || ''} onChange={(e) => {
                reset({ ...watch(), idPlanCupo: e.target.value })
                onChangePlanCupo()
              }}>
                <option value=''>Seleccione plan de cupo</option>
                {planesCupo && planesCupo.map((pc) => (
                  <option key={pc.idplancupo} value={pc.idplancupo}>{pc.tipoplan} ({pc.duracionmes}m)</option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              type='submit'
              disabled={isSubmitting}
              loading={{ state: isSubmitting, inactive: 'Guardar cambios', active: 'Guardando' }}
            />
            <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
          </div>
        </>
      )}
    </form>
  )
}
