'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaCupoVendido({ onSelect, selectedId }) {
  const { data: { cuposVendidos }, loading, error, solicitudApi } = useFetch()
  const [q, setQ] = useState('')

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

  useEffect(() => {
    if (!cuposVendidos) {
      solicitudApi('cupo-vendido', 'cuposVendidos')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuposVendidos])

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0)

  const activos = cuposVendidos?.filter(c => c.estado).length || 0
  const inactivos = cuposVendidos?.filter(c => !c.estado).length || 0
  const pendientes = cuposVendidos?.filter(c => {
    const proxPago = parseDate(c.proxpago)
    return c.estado && proxPago && proxPago < hoy
  }).length || 0

  const filtered = useMemo(() => {
    if (!cuposVendidos) return []
    const term = q.trim().toLowerCase()
    if (!term) return cuposVendidos
    return cuposVendidos.filter(c => {
      const cliente = `${c.persona?.nombres || ''} ${c.persona?.apellidos || ''}`.toLowerCase()
      const correo = String(c.planprincipal?.correo || '').toLowerCase()
      const planp = String(c.planprincipal?.nombreplan || '').toLowerCase()
      const planc = String(c.plancupo?.tipoplan || '').toLowerCase()
      const precio = String(c.plancupo?.precio || '').toLowerCase()
      const metodo = String(c.metodopago?.nombre || '').toLowerCase()
      const estado = c.estado ? 'activo' : 'inactivo'
      return (
        cliente.includes(term) ||
        correo.includes(term) ||
        planp.includes(term) ||
        planc.includes(term) ||
        precio.includes(term) ||
        metodo.includes(term) ||
        estado.includes(term) ||
        String(c.proxpago || '').toLowerCase().includes(term)
      )
    })
  }, [cuposVendidos, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Cupos vendidos</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por cliente, plan, correo, cupo, precio, método o estado"
            className="w-[420px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('cupo-vendido', 'cuposVendidos')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      {/* Resumen de cupos vendidos */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Cupos activos</p>
          <p className="text-2xl font-semibold text-title">{activos}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Cupos inactivos</p>
          <p className="text-2xl font-semibold text-title">{inactivos}</p>
        </div>
        <div className={`rounded-lg p-4 ${pendientes > 0 ? 'bg-amber-500/20' : 'bg-card border border-border'}`}>
          <p className={`${pendientes > 0 ? 'text-amber-300' : 'text-subtitle'} text-sm`}>Pagos pendientes</p>
          <p className={`text-2xl font-semibold ${pendientes > 0 ? 'text-amber-200' : 'text-title'}`}>{pendientes}</p>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">Cliente</th>
              <th className="py-4 px-4 text-left">Plan principal</th>
              <th className="py-4 px-4 text-left">Plan cupo</th>
              <th className="py-4 px-4 text-left">Precio</th>
              <th className="py-4 px-4 text-left">Próx. pago</th>
              <th className="py-4 px-4 text-left">Método</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((c, index) => (
              <tr
                key={c.idcupo}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === c.idcupo ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(c)}
              >
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{index + 1}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[220px]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      {`${(c.persona?.nombres || '').trim().charAt(0)}${(c.persona?.apellidos || '').trim().charAt(0)}`.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={`${c.persona?.nombres || ''} ${c.persona?.apellidos || ''}`}>{c.persona?.nombres} {c.persona?.apellidos}</p>
                      <p className="text-td text-[11px] opacity-70 truncate" title={c.persona?.telefono}>Tel: {c.persona?.telefono || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[240px]">
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={c.planprincipal?.nombreplan}>{c.planprincipal?.nombreplan}</p>
                      <p className="text-td text-[11px] opacity-70 truncate" title={c.planprincipal?.correo}>{c.planprincipal?.correo}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={c.plancupo?.tipoplan}>{c.plancupo?.tipoplan}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <span className="text-td">
                    {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(c.plancupo?.precio || 0))}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  {(() => {
                    const dt = parseDate(c.proxpago)
                    if (!dt) return <span className="text-td">-</span>
                    const today = new Date(); today.setHours(0,0,0,0)
                    const diff = dt.getTime() - today.getTime()
                    const days = Math.ceil(diff / (1000*60*60*24))
                    const label = fmtDate(c.proxpago)
                    const style = days < 0
                      ? 'bg-rose-500/20 text-rose-300'
                      : days <= 3
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    return <span className={`px-2 py-0.5 rounded text-xs ${style}`}>{label}</span>
                  })()}
                </td>
                <td className="whitespace-nowrap"><span className="text-td">{c.metodopago?.nombre}</span></td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {c.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activo</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactivo</span>}
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={10}>
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
                <td colSpan={10}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">{error}</p>
                    </div>
                  </nav>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan={10}>
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
