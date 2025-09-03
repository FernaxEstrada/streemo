'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaPagoPlan from '@/components/pages/gestionar/tablas/TablaPagoPlan'
import FormPagoPlan from '@/components/pages/gestionar/formularios/FormPagoPlan'

export interface PagoPlanPageItem {
  idpagoplan: string
  fechafacturacion: string
  fechapago: string
  monto: number
  metodopago: string
  tarjeta: string
  nota: string | null
  estadopagoplan: boolean
  idplanp: string
  nombreplan: string
  correo: string
  fechainicio: string
  costo: number
  proxpago: string | null
  direccionplan: string
  estado: boolean
  persona: { idpersona: string; nombres: string; apellidos: string }
}

export default function PagoPlanPage() {
  const [selected, setSelected] = useState<PagoPlanPageItem | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    cambiarData('pagosPlan', null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormPagoPlan selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaPagoPlan onSelect={setSelected} selectedId={selected?.idpagoplan || null} />
        </PageSection>
      </div>
    </section>
  )
}
