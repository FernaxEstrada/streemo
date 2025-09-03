'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaPlanPrincipal from '@/components/pages/gestionar/tablas/TablaPlanPrincipal'
import FormPlanPrincipal from '@/components/pages/gestionar/formularios/FormPlanPrincipal'

interface Persona { idpersona: string; nombres: string; apellidos: string }
interface MetodoPago { idmetpago: string; nombre: string }
interface Tarjeta { idtarjeta: string; numero: string; banco: string; vencimiento: string }

export interface PlanPrincipal {
  idplanp: string
  nombreplan: string
  correo: string
  fechainicio: string
  costo: number
  proxpago: string | null
  direccionplan: string
  estado: boolean
  persona: Persona
  metodopago: MetodoPago
  tarjeta: Tarjeta
}

export default function PlanPrincipalPage() {
  const [selected, setSelected] = useState<PlanPrincipal | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('planes', null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormPlanPrincipal selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaPlanPrincipal onSelect={setSelected} selectedId={selected?.idplanp || null} />
        </PageSection>
      </div>
    </section>
  )
}
