'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaPagoCupo({ onSelect, selectedId }) {
  const { data: { pagosCupo }, loading, error, solicitudApi } = useFetch()
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
    if (!pagosCupo) {
      solicitudApi('pago-cupo', 'pagosCupo')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagosCupo])

  const total = pagosCupo?.reduce((sum, p) => sum + (parseFloat(p.monto) || 0), 0) || 0

  const filtered = useMemo(() => {
    if (!pagosCupo) return []
    const term = q.trim().toLowerCase()
    if (!term) return pagosCupo
    return pagosCupo.filter(p => {
      const cliente = `${p.cupovendido?.persona?.nombres || ''} ${p.cupovendido?.persona?.apellidos || ''}`.toLowerCase()
      const planp = String(p.cupovendido?.planprincipal?.nombreplan || '').toLowerCase()
      const correo = String(p.cupovendido?.planprincipal?.correo || '').toLowerCase()
      const planc = String(p.cupovendido?.plancupo?.tipoplan || '').toLowerCase()
      const metodo = String(p.cupovendido?.metodopago?.nombre || '').toLowerCase()
      const monto = String(p.monto || '').toLowerCase()
      const estado = p.estado ? 'completado' : 'cancelado'
      return (
        cliente.includes(term) ||
        planp.includes(term) ||
        correo.includes(term) ||
        planc.includes(term) ||
        metodo.includes(term) ||
        monto.includes(term) ||
        estado.includes(term) ||
        String(p.fechafacturacion || '').toLowerCase().includes(term) ||
        String(p.fechapago || '').toLowerCase().includes(term)
      )
    })
  }, [pagosCupo, q])

  const truncate = (str, n) => {
    const s = String(str || '')
    return s.length > n ? s.slice(0, n - 1) + '…' : s
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Pagos de cupo</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por cliente, plan, correo, cupo, fecha, método, monto o estado"
            className="w-[460px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('pago-cupo', 'pagosCupo')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      {/* Resumen de pagos */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Total pagado</p>
          <p className="text-2xl font-semibold text-title">
            {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(total)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-subtitle text-sm">Total de pagos</p>
          <p className="text-2xl font-semibold text-title">
            {pagosCupo?.length || 0}
          </p>
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
              <th className="py-4 px-4 text-left">Facturación</th>
              <th className="py-4 px-4 text-left">Pago</th>
              <th className="py-4 px-4 text-left">Monto</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((p, index) => (
              <tr
                key={p.idpagocupo}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === p.idpagocupo ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(p)}
              >
                <td className="whitespace-nowrap"><span className="text-td">{index + 1}</span></td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[220px]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      {`${(p.cupovendido?.persona?.nombres || '').trim().charAt(0)}${(p.cupovendido?.persona?.apellidos || '').trim().charAt(0)}`.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={`${p.cupovendido?.persona?.nombres || ''} ${p.cupovendido?.persona?.apellidos || ''}`}>
                        {`${(p.cupovendido?.persona?.nombres || '').split(' ')[0]} ${((p.cupovendido?.persona?.apellidos || '').split(' ')[0] || '').charAt(0)}.`}
                      </p>
                      <p className="text-td text-[11px] opacity-70 truncate" title={p.cupovendido?.persona?.telefono}>Tel: {p.cupovendido?.persona?.telefono || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[240px]">
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={p.cupovendido?.planprincipal?.nombreplan}>{truncate(p.cupovendido?.planprincipal?.nombreplan, 18)}</p>
                      <p className="text-td text-[11px] opacity-70 truncate" title={p.cupovendido?.planprincipal?.correo}>{p.cupovendido?.planprincipal?.correo}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={p.cupovendido?.plancupo?.tipoplan}>{truncate(p.cupovendido?.plancupo?.tipoplan, 16)}</p>
                      <p className="text-td text-[11px] opacity-70 truncate" title='Precio cupo'>
                        {new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(p.cupovendido?.plancupo?.precio || 0))}
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
                  <span className={`font-medium ${p.estado ? 'text-emerald-400' : 'text-amber-400'}`}>
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
                <td colSpan={8}>
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
                <td colSpan={8}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">{error}</p>
                    </div>
                  </nav>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan={8}>
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
