'use client'
import { useFetch } from "@/hooks/useFetch";
import { useEffect, useMemo, useState } from "react"
import { HiRefresh } from "react-icons/hi";

export default function TablaPersona({ onSelect, selectedId }) {
  const { data: { personas }, loading, error, solicitudApi } = useFetch();
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!personas) {
      solicitudApi('persona', 'personas')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas])
  const filtered = useMemo(() => {
    if (!personas) return []
    const term = q.trim().toLowerCase()
    if (!term) return personas
    return personas.filter(p => {
      const nombre = `${p.nombres || ''} ${p.apellidos || ''}`.toLowerCase()
      const roles = [p.tipoap && 'ap', p.tipoc && 'c', p.tiposa && 'sa'].filter(Boolean).join(' ')
      return (
        nombre.includes(term) ||
        String(p.telefono || '').toLowerCase().includes(term) ||
        String(p.sexo || '').toLowerCase().includes(term) ||
        roles.includes(term)
      )
    })
  }, [personas, q])
  return (
    <div className="w-full overflow-x-auto">

      <div className='pb-4 flex w-full justify-between items-center gap-2 font-semibold'>
        <h1 className="text-title text-lg">Tabla de Personas</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar por nombre, apellido, teléfono o rol"
            className="w-[300px] rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-3 py-2"
          />
          <button onClick={() => solicitudApi('persona', 'personas')} className="flex gap-1.5 items-center justify-center px-4 py-1.5 bg-primary rounded-md cursor-pointer"><HiRefresh size={'1.2rem'} /> Refrescar</button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="py-4 px-4 text-left">#</th>
              <th className="py-4 px-4 text-left">ID</th>
              <th className="py-4 px-4 text-left">Nombre</th>
              <th className="py-4 px-4 text-left table-cell">Apellidos</th>
              <th className="py-4 px-4 text-left table-cell">Telefono</th>
              <th className="py-4 px-4 text-left table-cell">Sexo</th>
              <th className="py-4 px-4 text-left table-cell">Roles</th>
              <th className="py-4 px-4 text-left table-cell">Estado</th>
            </tr>
          </thead>
          <tbody>

            {/* Ok */}
            {filtered && filtered.map((data, index) => (
              <tr
                key={index + 1}
                className={`relative hover:bg-dark cursor-pointer ${selectedId === data.idpersona ? 'bg-dark' : ''}`}
                onClick={() => onSelect && onSelect(data)}
              >
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{index + 1}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-td font-mono" title={data.idpersona}>
                      {String(data.idpersona).slice(0, 8)}…
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{data.nombres}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{data.apellidos}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{data.telefono}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex">
                    <span className="text-td">{data.sexo}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex gap-2 text-xs">
                    {data.tipoap ? <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">AP</span> : null}
                    {data.tipoc ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">C</span> : null}
                    {data.tiposa ? <span className="px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400">SA</span> : null}
                    {!data.tipoap && !data.tipoc && !data.tiposa ? <span className="text-subtitle">-</span> : null}
                  </div>
                </td>
                <td className="whitespace-nowrap">
                  <div className="flex text-xs">
                    {data.estado
                      ? <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Activo</span>
                      : <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">Inactivo</span>}
                  </div>
                </td>
              </tr>
            ))}

            {/* Cargando */}
            {loading &&
              <tr>
                <td colSpan={8}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">Cargando</p>
                    </div>
                  </nav>
                </td>
              </tr>}

            {/* Error */}
            {error &&
              <tr>
                <td colSpan={8}>
                  <nav className="flex items-center justify-between overflow-hidden">
                    <div className="block">
                      <p className="text-xs text-td">{error}</p>
                    </div>
                  </nav>
                </td>
              </tr>}

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
