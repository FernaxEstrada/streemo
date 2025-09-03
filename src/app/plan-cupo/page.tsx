'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaPlanCupo from '@/components/pages/gestionar/tablas/TablaPlanCupo'
import FormPlanCupo from '@/components/pages/gestionar/formularios/FormPlanCupo'

export type PlanCupo = {
  idplancupo: string
  tipoplan: string
  duracionmes: number
  promo: boolean
  precio: number
  estado?: boolean
}

export default function PlanCupoPage() {
  const [selected, setSelected] = useState<PlanCupo | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('planesCupo', null)
    setSelected(null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormPlanCupo selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaPlanCupo onSelect={setSelected} selectedId={selected?.idplancupo} />
        </PageSection>
      </div>
    </section>
  )
}
