'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaPlanCupo({ onSelect, selectedId }) {
  const { data: { planesCupo }, loading, error, solicitudApi } = useFetch()
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!planesCupo) {
      solicitudApi('plan-cupo', 'planesCupo')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planesCupo])

  const filtered = useMemo(() => {
    if (!planesCupo) return []
    const term = q.trim().toLowerCase()
    if (!term) return planesCupo
    return planesCupo.filter(p => (
      String(p.idplancupo || '').toLowerCase().includes(term) ||
      String(p.tipoplan || '').toLowerCase().includes(term) ||
      String(p.duracionmes || '').toLowerCase().includes(term) ||
      String(p.precio || '').toLowerCase().includes(term) ||
      (p.estado ? 'activo' : 'inactivo').includes(term)
    ))
  }, [planesCupo, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Planes de Cupo</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por tipo, duración, precio o estado"
            className="w-[320px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('plan-cupo', 'planesCupo')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">ID</th>
              <th className="py-4 px-4 text-left">Tipo</th>
              <th className="py-4 px-4 text-left">Duración (meses)</th>
              <th className="py-4 px-4 text-left">Promo</th>
              <th className="py-4 px-4 text-left">Precio</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((p, index) => (
              <tr
                key={p.idplancupo}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === p.idplancupo ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(p)}
              >
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{index + 1}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-td font-mono" title={p.idplancupo}>
                      {String(p.idplancupo).slice(0, 8)}…
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{p.tipoplan}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{p.duracionmes}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {p.promo
                      ? <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Sí</span>
                      : <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-400">No</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(p.precio)}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {p.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activo</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactivo</span>}
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
