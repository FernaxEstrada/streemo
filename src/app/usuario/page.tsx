'use client'
import PageSection from "@/components/PageSection"
import { useState } from "react"
import { useData } from "@/context/DataContext"
import FormUsuario from "@/components/pages/gestionar/formularios/FormUsuario"
import TablaUsuario from "@/components/pages/gestionar/tablas/TablaUsuario"

export type UsuarioItem = {
  idpersona: string
  usuario: string
  estado: boolean
  persona: {
    idpersona: string
    nombres: string
    apellidos: string
    telefono: string
    sexo: string
    tipoap?: boolean
    tipoc?: boolean
    tiposa?: boolean
    estado?: boolean
  }
}

export default function UsuarioPage() {
  const [selected, setSelected] = useState<UsuarioItem | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('usuarios', null)
  }

  return (
    <section className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <PageSection>
          <FormUsuario selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className="col-span-8">
        <PageSection>
          <TablaUsuario onSelect={setSelected} selectedId={selected?.idpersona} />
        </PageSection>
      </div>
    </section>
  )
}
