'use client'
import { useEffect, useMemo, useState } from 'react'
import { HiRefresh } from 'react-icons/hi'
import { useFetch } from '@/hooks/useFetch'

export default function TablaTarjeta({ onSelect, selectedId }) {
  const { data: { tarjetas }, loading, error, solicitudApi } = useFetch()
  const [q, setQ] = useState('')

  const initials = (nombres = '', apellidos = '') => {
    const a = (nombres || '').trim().charAt(0)
    const b = (apellidos || '').trim().charAt(0)
    return (a + b).toUpperCase() || 'D'
  }

  useEffect(() => {
    if (!tarjetas) {
      solicitudApi('tarjeta', 'tarjetas')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarjetas])

  const filtered = useMemo(() => {
    if (!tarjetas) return []
    const term = q.trim().toLowerCase()
    if (!term) return tarjetas
    return tarjetas.filter(t => (
      String(t.numero || '').toLowerCase().includes(term) ||
      String(t.banco || '').toLowerCase().includes(term) ||
      String(t.vencimiento || '').toLowerCase().includes(term) ||
      `${t.persona?.nombres || ''} ${t.persona?.apellidos || ''}`.toLowerCase().includes(term) ||
      (t.estado ? 'activa' : 'inactiva').includes(term)
    ))
  }, [tarjetas, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Tarjetas</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por número, banco, vencimiento, dueño o estado"
            className="w-[360px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('tarjeta', 'tarjetas')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">ID</th>
              <th className="py-4 px-4 text-left">Número</th>
              <th className="py-4 px-4 text-left">Banco</th>
              <th className="py-4 px-4 text-left">Vencimiento</th>
              <th className="py-4 px-4 text-left">Dueño</th>
              <th className="py-4 px-4 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((t, index) => (
              <tr
                key={t.idtarjeta}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === t.idtarjeta ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(t)}
              >
                <td className="whitespace-nowrap"><span className="text-td">{index + 1}</span></td>
                <td className="whitespace-nowrap"><span className="text-td font-mono" title={t.idtarjeta}>{String(t.idtarjeta).slice(0,8)}…</span></td>
                <td className="whitespace-nowrap"><span className="text-td">{t.numero}</span></td>
                <td className="whitespace-nowrap"><span className="text-td">{t.banco}</span></td>
                <td className="whitespace-nowrap"><span className="text-td">{t.vencimiento}</span></td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-2 max-w-[220px]">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      {initials(t.persona?.nombres, t.persona?.apellidos)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-td leading-4 font-medium truncate" title={`${t.persona?.nombres || ''} ${t.persona?.apellidos || ''}`}>{t.persona?.nombres} {t.persona?.apellidos}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {t.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activa</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactiva</span>}
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
