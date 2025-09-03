'use client'
import PageSection from '@/components/PageSection'
import { useState } from 'react'
import { useData } from '@/context/DataContext'
import TablaPagoCupo from '@/components/pages/gestionar/tablas/TablaPagoCupo'
import FormPagoCupo from '@/components/pages/gestionar/formularios/FormPagoCupo'

export type PagoCupo = {
  idpagocupo: string
  fechafacturacion: string
  fechapago: string
  mesespagados: number
  monto: number
  metodopago: string
  nota?: string | null
  estado: boolean
  cupovendido: {
    idcupo: string
    usuario: string
    fechainicio: string
    proxpago?: string
    nota?: string
    estado?: boolean
    persona: { idpersona: string; nombres: string; apellidos: string; telefono?: string }
    planprincipal: { idplanp: string; nombreplan: string; correo?: string }
    plancupo: { idplancupo: string; tipoplan: string; precio?: number | string; duracionmes?: number }
    metodopago: { idmetpago: string; nombre: string }
  }
}

export default function PagoCupoPage() {
  const [selected, setSelected] = useState<PagoCupo | null>(null)
  const { cambiarData } = useData()

  const handleSaved = () => {
    // invalidar lista para recargar
    cambiarData('pagosCupo', null)
    // también refrescar cupos para ver ProxPago actualizado
    cambiarData('cuposVendidos', null)
    // limpiar selección para volver a estado inicial
    setSelected(null)
  }

  return (
    <section className='grid grid-cols-12 gap-4'>
      <div className='col-span-4'>
        <PageSection>
          <FormPagoCupo selected={selected} onSaved={handleSaved} onCancel={() => setSelected(null)} />
        </PageSection>
      </div>
      <div className='col-span-8'>
        <PageSection>
          <TablaPagoCupo onSelect={setSelected} selectedId={selected?.idpagocupo} />
        </PageSection>
      </div>
    </section>
  )
}
