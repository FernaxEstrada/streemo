'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaMetodoPago({ onSelect, selectedId }) {
  const { data: { metodosPago }, loading, error, solicitudApi } = useFetch()
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!metodosPago) {
      solicitudApi('metodo-pago', 'metodosPago')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodosPago])

  const filtered = useMemo(() => {
    if (!metodosPago) return []
    const term = q.trim().toLowerCase()
    if (!term) return metodosPago
    return metodosPago.filter(m => (
      String(m.idmetpago || '').toLowerCase().includes(term) ||
      String(m.nombre || '').toLowerCase().includes(term) ||
      (m.estado ? 'activo' : 'inactivo').includes(term)
    ))
  }, [metodosPago, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Métodos de Pago</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre, ID o estado"
            className="w-[320px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('metodo-pago', 'metodosPago')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">ID</th>
              <th className="py-4 px-4 text-left">Nombre</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((m, index) => (
              <tr
                key={m.idmetpago}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === m.idmetpago ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(m)}
              >
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{index + 1}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-td font-mono" title={m.idmetpago}>
                      {String(m.idmetpago).slice(0, 8)}…
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{m.nombre}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {m.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activo</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactivo</span>}
                  </div>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={4}>
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
                <td colSpan={4}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">{error}</p>
                    </div>
                  </nav>
                </td>
              </tr>
            )}

            <tr>
              <td colSpan={4}>
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
