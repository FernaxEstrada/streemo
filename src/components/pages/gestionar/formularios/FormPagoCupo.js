'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useFetch } from '@/hooks/useFetch'

export default function FormPagoCupo({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    shouldUnregister: true,
    defaultValues: { idCupo: '', fechaPago: '', nota: '' }
  })

  const { data: { cuposVendidos }, loading, error, solicitudApi } = useFetch()

  const idCupoSeleccionado = watch('idCupo')
  const cupoSeleccionado = (cuposVendidos || []).find(c => c.idcupo === idCupoSeleccionado)

  useEffect(() => {
    if (!cuposVendidos) solicitudApi('cupo-vendido', 'cuposVendidos')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuposVendidos])

  const toDMY = (s) => {
    if (!s) return s
    // expects 'YYYY-MM-DD' from input[type=date]
    const parts = String(s).split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
    // fallback: try Date
    const dt = new Date(s)
    if (isNaN(dt.getTime())) return s
    const dd = String(dt.getDate()).padStart(2, '0')
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const yy = dt.getFullYear()
    return `${dd}/${mm}/${yy}`
  }

  useEffect(() => {
    if (!selected) {
      reset({ idCupo: '', fechaPago: '', nota: '' })
    } else {
      // edición: solo nota/estado por APIs separadas
      reset({ idCupo: selected?.cupovendido?.idcupo || '', fechaPago: '', nota: selected.nota || '' })
    }
  }, [selected, reset])

  const renderResumenCupo = (cupo) => {
    if (!cupo) return null
    const fmt = (dateStr) => {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }
    return (
      <div className='relative overflow-hidden rounded-xl border border-sky-400/20 bg-gradient-to-br from-sky-600/15 via-blue-500/10 to-indigo-500/10 p-4'>
        <div className='relative z-10'>
          <p className='text-subtitle text-[11px] uppercase tracking-wide'>Cupo seleccionado</p>
          <h4 className='text-title text-lg font-semibold'>{cupo.plancupo?.tipoplan}</h4>
          <div className='mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Cliente</p>
              <p className='text-title'>{cupo.persona?.nombres} {cupo.persona?.apellidos}</p>
              <p className='text-[11px] text-subtitle'>Tel: {cupo.persona?.telefono || '-'}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Usuario</p>
              <p className='text-title font-mono'>{cupo.usuario || '-'}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Plan principal</p>
              <p className='text-title'>{cupo.planprincipal?.nombreplan}</p>
              <p className='text-[11px] text-subtitle'>{cupo.planprincipal?.correo}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Precio cupo</p>
              <p className='text-title'>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(cupo.plancupo?.precio || 0))}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Inicio</p>
              <p className='text-title'>{fmt(cupo.fechainicio)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Próx. pago</p>
              <p className='text-title'>{fmt(cupo.proxpago)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Método</p>
              <p className='text-title'>{cupo.metodopago?.nombre}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSubmitCrear = async (values) => {
    if (selected?.idpagocupo) {
      toast.info('Para registrar un nuevo pago, deselecciona el pago actual.')
      return
    }
    const body = {
      idCupo: values.idCupo,
      fechaPago: toDMY(values.fechaPago),
      nota: values.nota || undefined
    }
    const res = await apiClient('/pago-cupo', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    if (res.error) return toast.error(res.msg)
    toast.success(res.msg)
    onSaved?.()
  }

  const onActualizarNota = async (values) => {
    if (!selected?.idpagocupo || values.nota === selected.nota) {
      toast.info('No hay cambios en la nota')
      return
    }

    const res = await apiClient(`/pago-cupo/${selected.idpagocupo}/nota`, {
      method: 'PATCH',
      body: JSON.stringify({ idPagoCupo: selected.idpagocupo, nota: values.nota })
    })

    if (res.error) return toast.error(res.msg)
    toast.success('Nota actualizada correctamente')
    onSaved?.()
  }

  const onActualizarEstado = async (nuevoEstado) => {
    if (!selected?.idpagocupo || nuevoEstado === selected.estado) {
      return
    }

    const res = await apiClient(`/pago-cupo/${selected.idpagocupo}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ idPagoCupo: selected.idpagocupo, estado: nuevoEstado })
    })

    if (res.error) return toast.error(res.msg)
    toast.success(`Pago marcado como ${nuevoEstado ? 'Completado' : 'Cancelado'}`)
    onSaved?.()
  }

  const renderResumen = () => {
    if (!selected) return null

    const fmt = (dateStr) => {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }

    return (
      <div className='relative overflow-hidden rounded-xl border border-sky-400/20 bg-gradient-to-br from-sky-600/15 via-blue-500/10 to-indigo-500/10 p-4'>
        <div className='absolute right-3 top-3'>
          {selected.estado ? (
            <span className='px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs'>Completado</span>
          ) : (
            <span className='px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs'>Cancelado</span>
          )}
        </div>
        <div className='relative z-10'>
          <p className='text-subtitle text-[11px] uppercase tracking-wide'>Pago de Cupo</p>
          <h4 className='text-title text-lg font-semibold'>{selected.cupovendido?.plancupo?.tipoplan}</h4>
          <div className='mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Cliente</p>
              <p className='text-title'>{selected.cupovendido?.persona?.nombres} {selected.cupovendido?.persona?.apellidos}</p>
              <p className='text-[11px] text-subtitle'>Tel: {selected.cupovendido?.persona?.telefono || '-'}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Monto</p>
              <p className='text-title font-semibold'>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(selected.monto || 0)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Usuario</p>
              <p className='text-title font-mono'>{selected.cupovendido?.usuario || '-'}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Plan principal</p>
              <p className='text-title'>{selected.cupovendido?.planprincipal?.nombreplan}</p>
              <p className='text-[11px] text-subtitle'>{selected.cupovendido?.planprincipal?.correo}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Precio cupo</p>
              <p className='text-title'>{new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(selected.cupovendido?.plancupo?.precio || 0))}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Inicio</p>
              <p className='text-title'>{fmt(selected.cupovendido?.fechainicio)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Facturación</p>
              <p className='text-title'>{fmt(selected.fechafacturacion)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Pagado el</p>
              <p className='text-title'>{fmt(selected.fechapago)}</p>
            </div>
            <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
              <p className='text-[11px] text-subtitle uppercase tracking-wide'>Método</p>
              <p className='text-title'>{selected.metodopago}</p>
            </div>
            {typeof selected.mesespagados !== 'undefined' && (
              <div className='rounded-md border border-sky-400/20 bg-dark/30 p-2'>
                <p className='text-[11px] text-subtitle uppercase tracking-wide'>Meses pagados</p>
                <p className='text-title'>{selected.mesespagados}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(selected ? onActualizarNota : onSubmitCrear)} className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-title font-semibold'>{selected ? 'Detalles del pago de cupo' : 'Nuevo pago de cupo'}</h3>
      </div>

      {selected ? renderResumen() : (
        <div className='space-y-4'>
          {idCupoSeleccionado && renderResumenCupo(cupoSeleccionado)}
          <div className='space-y-2'>
            <label htmlFor='idCupo' className='block text-sm text-subtitle'>Cupo vendido</label>
            <select
              id='idCupo'
              className='w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-title focus:outline-none focus:ring-2 focus:ring-primary/50'
              {...register('idCupo', { required: true })}
            >
              <option value=''>Seleccione un cupo{loading ? ' (cargando...)' : ''}</option>
              {cuposVendidos && cuposVendidos.map((c) => (
                <option key={c.idcupo} value={c.idcupo}>
                  {c.persona?.nombres} {c.persona?.apellidos} — {c.plancupo?.tipoplan} — {c.usuario}
                </option>
              ))}
            </select>
            {error && <p className='text-xs text-rose-400'>Error cargando cupos: {error}</p>}
            {errors.idCupo && <p className='text-xs text-rose-400'>Campo obligatorio</p>}
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
