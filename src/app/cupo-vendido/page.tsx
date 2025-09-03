'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaCupoVendido from '@/components/pages/gestionar/tablas/TablaCupoVendido'
import FormCupoVendido from '@/components/pages/gestionar/formularios/FormCupoVendido'

export type CupoVendido = {
  idcupo: string
  usuario: string
  fechainicio: string
  proxpago?: string
  nota?: string
  estado?: boolean
  persona: { idpersona: string; nombres: string; apellidos: string }
  planprincipal: { idplanp: string; nombreplan: string }
  plancupo: { idplancupo: string; tipoplan: string }
  metodopago: { idmetpago: string; nombre: string }
}

export default function CupoVendidoPage() {
  const [selected, setSelected] = useState<CupoVendido | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('cuposVendidos', null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormCupoVendido selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaCupoVendido onSelect={setSelected} selectedId={selected?.idcupo} />
        </PageSection>
      </div>
    </section>
  )
}
