'use client'
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useMemo, useState } from "react";
import { HiRefresh } from "react-icons/hi";

export default function TablaUsuario({ onSelect, selectedId }) {
  const { data: { usuarios }, loading, error, solicitudApi } = useFetch();
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!usuarios) {
      solicitudApi('usuario', 'usuarios')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarios])

  const filtered = useMemo(() => {
    if (!usuarios) return []
    const term = q.trim().toLowerCase()
    if (!term) return usuarios
    return usuarios.filter(u => {
      const nombre = `${u.persona?.nombres || ''} ${u.persona?.apellidos || ''}`.toLowerCase()
      return (
        String(u.usuario || '').toLowerCase().includes(term) ||
        nombre.includes(term) ||
        String(u.persona?.telefono || '').toLowerCase().includes(term)
      )
    })
  }, [usuarios, q])

  return (
    <div className="w-full overflow-x-auto">
      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Tabla de Usuarios</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por usuario, nombre o teléfono"
            className="w-[280px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('usuario', 'usuarios')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">ID Persona</th>
              <th className="py-4 px-4 text-left">Usuario</th>
              <th className="py-4 px-4 text-left">Nombre</th>
              <th className="py-4 px-4 text-left table-cell">Teléfono</th>
              <th className="py-4 px-4 text-left table-cell">Estado Usuario</th>
              <th className="py-4 px-4 text-left table-cell">Estado Persona</th>
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((u, index) => (
              <tr
                key={u.idpersona}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === u.idpersona ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(u)}
              >
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{index + 1}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-td font-mono" title={u.idpersona}>
                      {String(u.idpersona).slice(0, 8)}…
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{u.usuario}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{u.persona?.nombres} {u.persona?.apellidos}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{u.persona?.telefono}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {u.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activo</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactivo</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {u.persona?.estado
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
