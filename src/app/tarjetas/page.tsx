'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaTarjeta from '@/components/pages/gestionar/tablas/TablaTarjeta'
import FormTarjeta from '@/components/pages/gestionar/formularios/FormTarjeta'

interface Tarjeta {
  idtarjeta: string
  numero: string
  banco: string
  vencimiento: string
  estado?: boolean
  persona?: {
    idpersona: string
    nombres: string
    apellidos: string
  }
}

export default function TarjetasPage() {
  const [selected, setSelected] = useState<Tarjeta | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('tarjetas', null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormTarjeta selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaTarjeta onSelect={setSelected} selectedId={selected?.idtarjeta || null} />
        </PageSection>
      </div>
    </section>
  )
}
