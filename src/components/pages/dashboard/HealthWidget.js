"use client"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/apiClient"

export default function HealthWidget() {
  const [state, setState] = useState({ loading: true, error: null, time: null })
  const [updatedAt, setUpdatedAt] = useState(null)

  async function fetchHealth() {
    try {
      setState((s) => ({ ...s, loading: true }))
      const { data, error, msg } = await apiClient("/ping", { method: "GET" })
      if (error) {
        setState({ loading: false, error: msg || "Error", time: null })
      } else {
        setState({ loading: false, error: null, time: data })
        setUpdatedAt(Date.now())
      }
    } catch (err) {
      setState({ loading: false, error: err.message, time: null })
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-title">Estado del sistema</h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs ${state.loading ? "bg-yellow-500/20 text-yellow-400" : state.error ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            {state.loading ? "Cargando" : state.error ? "Error" : "OK"}
          </span>
          <button
            onClick={fetchHealth}
            disabled={state.loading}
            className={`px-2 py-1 rounded-md text-xs border ${state.loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} border-border text-title hover:bg-dark`}
            title="Refrescar"
          >
            Refrescar
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-subtitle">
        {state.loading && <p>Verificando conexión con la base de datos...</p>}
        {!state.loading && state.error && (
          <p>Fallo en health-check: {state.error}</p>
        )}
        {!state.loading && !state.error && (
          <div className="space-y-1">
            <p>DB responde. Hora del servidor: <span className="text-td-alt font-medium">{new Date(state.time).toLocaleString()}</span></p>
            {updatedAt && (
              <p className="text-xs">Actualizado: <span className="text-td-alt">{new Date(updatedAt).toLocaleTimeString()}</span></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
