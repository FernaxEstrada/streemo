'use client'
import TablaPersona from "../../components/pages/gestionar/tablas/TablaPersona"
import PageSection from "@/components/PageSection"
import FormPersonaGeneral from "@/components/pages/gestionar/formularios/FormPersonaGeneral"
import { useState } from "react"
import { useData } from "@/context/DataContext"

type Persona = {
  idpersona: number
  nombres: string
  apellidos: string
  telefono: string
  sexo: string
  estado?: boolean
}

export default function PersonaPage() {
  const [selected, setSelected] = useState<Persona | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('personas', null)
    // mantener selección si existía (se actualizará con nuevos datos en fetch)
  }

  return (
    <section className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <PageSection>
          <FormPersonaGeneral selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className="col-span-8">
        <PageSection>
          <TablaPersona onSelect={setSelected} selectedId={selected?.idpersona} />
        </PageSection>
      </div>
    </section>
  )
}