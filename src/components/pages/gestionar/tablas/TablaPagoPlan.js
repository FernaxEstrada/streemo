'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaPagoPlan({ onSelect, selectedId }) {
  const { data: { pagosPlan, planes }, loading, error, solicitudApi } = useFetch()
  const [q, setQ] = useState('')

  // Obtener la información del plan desde el pago
  const getPlanInfo = (pago) => {
    if (!pago?.planprincipal) {
      return {
        nombreplan: 'Plan no encontrado',
        persona: { nombres: '', apellidos: '', correo: '' },
        idplanp: ''
      }
    }
    return {
      ...pago.planprincipal,
      persona: pago.planprincipal.persona || { nombres: '', apellidos: '' },
      correo: pago.planprincipal.correo || ''
    }
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

  const initials = (nombres = '', apellidos = '') => {
    const a = (nombres || '').trim().charAt(0)
    const b = (apellidos || '').trim().charAt(0)
    return (a + b).toUpperCase() || 'A'
  }

  useEffect(() => {
    if (!pagosPlan || !planes) {
      solicitudApi('pago-plan', 'pagosPlan')
      solicitudApi('plan-principal', 'planes')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagosPlan, planes])

  const filtered = useMemo(() => {
    if (!pagosPlan) return []
    const term = q.trim().toLowerCase()
    if (!term) return pagosPlan
    return pagosPlan.filter(p => {
      const plan = String(p.planprincipal?.nombreplan || '').toLowerCase()
      const admin = `${p.planprincipal?.persona?.nombres || ''} ${p.planprincipal?.persona?.apellidos || ''}`.toLowerCase()
      const correo = String(p.planprincipal?.correo || '').toLowerCase()
      const monto = String(p.monto || '').toLowerCase()
      const estado = p.estado ? 'completado' : 'cancelado'
      return (
        plan.includes(term) ||
        admin.includes(term) ||
        correo.includes(term) ||
        monto.includes(term) ||
        estado.includes(term) ||
        String(p.fechafacturacion || '').toLowerCase().includes(term) ||
        String(p.fechapago || '').toLowerCase().includes(term)
      )
    })
  }, [pagosPlan, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Pagos de planes</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por plan, admin, correo, fechas, monto o estado"
            className="w-[420px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('pago-plan', 'pagosPlan')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      {/* Resumen de pagos */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Total pagado</p>
          <p className="text-2xl font-semibold text-title">
            {pagosPlan?.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0).toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Total de pagos</p>
          <p className="text-2xl font-semibold text-title">
            {pagosPlan?.length || 0}
          </p>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">Plan</th>
              <th className="py-4 px-4 text-left">Admin</th>
              <th className="py-4 px-4 text-left">Facturación</th>
              <th className="py-4 px-4 text-left">Pago</th>
              <th className="py-4 px-4 text-left">Monto</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((p, index) => (
              <tr
                key={p.idpagoplan}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === p.idpagoplan ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect({ ...p, persona: p.planprincipal?.persona })}
              >
                <td className="whitespace-nowrap"><span className="text-td">{index + 1}</span></td>
                <td className="whitespace-nowrap">
                  <div className="min-w-[180px]">
                    <p className="text-td font-medium">{getPlanInfo(p)?.nombreplan}</p>
                    <p className="text-td text-xs opacity-70">ID: {p.planprincipal?.idplanp?.substring(0, 8)}...</p>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[220px]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      {initials(p.planprincipal?.persona?.nombres, p.planprincipal?.persona?.apellidos)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={`${p.planprincipal?.persona?.nombres || ''} ${p.planprincipal?.persona?.apellidos || ''}`}>
                        {p.planprincipal?.persona?.nombres} {p.planprincipal?.persona?.apellidos}
                      </p>
                      <p className="text-td text-[11px] opacity-70 truncate" title={p.planprincipal?.correo}>
                        {p.planprincipal?.correo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-td">{fmtDate(p.fechafacturacion)}</span>
                    <span className="text-xs opacity-70">Facturación</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-td">{fmtDate(p.fechapago)}</span>
                    <span className="text-xs opacity-70">Pago registrado</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <span className={`font-medium ${p.estadopagoplan ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(p.monto || 0)}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {p.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Completado</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Cancelado</span>}
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={7}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">Cargando</p>
                    </div>
                  </nav>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={7}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">{error}</p>
                    </div>
                  </nav>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan={7}>
                <nav className="flex items-center justify-between overflow-hidden">
                  <div className="block">
                    <p className="text-xs text-td">
                      Mostrando <span className="px-1 font-medium text-td-alt">{filtered && filtered.length || 0}</span> resultados
                    </p>
                  </div>
                </nav>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
