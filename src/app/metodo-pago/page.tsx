'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaMetodoPago from '@/components/pages/gestionar/tablas/TablaMetodoPago'
import FormMetodoPago from '@/components/pages/gestionar/formularios/FormMetodoPago'

type MetodoPago = {
  idmetpago: string
  nombre: string
  estado?: boolean
}

export default function MetodoPagoPage() {
  const [selected, setSelected] = useState<MetodoPago | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('metodosPago', null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormMetodoPago selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaMetodoPago onSelect={setSelected} selectedId={selected?.idmetpago} />
        </PageSection>
      </div>
    </section>
  )
}
