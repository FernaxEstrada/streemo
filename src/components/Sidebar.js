'use client'
import Link from "next/link";
import { HiCurrencyDollar, HiUserGroup, HiCreditCard } from "react-icons/hi";
import { MdAssignment, MdCardMembership, MdPointOfSale, MdReceiptLong, MdSell, MdManageAccounts } from "react-icons/md";
import { usePathname } from "next/navigation";
import Logo from "@/components/illustations/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href) => pathname?.startsWith(href);
  return (
    <aside className="fixed w-[220px] h-full top-0 bottom-0 left-0 bg-dark z-20 flex flex-col border-r border-border" >
      <div className="w-[220px] h-18 border-b border-border flex items-center justify-center">
        <Link href={'/'} aria-label="Inicio">
          <Logo width={120} height={120} altura='full' isWhite={true} />
        </Link>
      </div>
      <nav className="flex flex-col py-4 gap-4 px-3">
        <div>
          <p className="px-3 pb-1 text-[11px] uppercase tracking-wide text-subtitle/70">Administración</p>
          <div className="flex flex-col gap-2">
            <Link href="/plan-principal" aria-current={isActive('/plan-principal') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/plan-principal') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdAssignment size='1.3rem' />
                <span className="font-semibold text-sm">Plan principal</span>
              </div>
            </Link>
            <Link href="/plan-cupo" aria-current={isActive('/plan-cupo') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/plan-cupo') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdCardMembership size='1.3rem' />
                <span className="font-semibold text-sm">Planes de cupo</span>
              </div>
            </Link>
            <Link href="/cupo-vendido" aria-current={isActive('/cupo-vendido') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/cupo-vendido') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdSell size='1.3rem' />
                <span className="font-semibold text-sm">Cupo vendido</span>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <p className="px-3 pb-1 text-[11px] uppercase tracking-wide text-subtitle/70">Pagos</p>
          <div className="flex flex-col gap-2">
            <Link href="/pago-cupo" aria-current={isActive('/pago-cupo') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/pago-cupo') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdPointOfSale size='1.3rem' />
                <span className="font-semibold text-sm">Pagos de cupo</span>
              </div>
            </Link>
            <Link href="/pago-plan" aria-current={isActive('/pago-plan') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/pago-plan') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdReceiptLong size='1.3rem' />
                <span className="font-semibold text-sm">Pagos de planes</span>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <p className="px-3 pb-1 text-[11px] uppercase tracking-wide text-subtitle/70">Configuración</p>
          <div className="flex flex-col gap-2">
            <Link href="/usuario" aria-current={isActive('/usuario') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/usuario') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <MdManageAccounts size='1.3rem' />
                <span className="font-semibold text-sm">Usuarios</span>
              </div>
            </Link>
            <Link href="/personas" aria-current={isActive('/personas') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/personas') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <HiUserGroup size='1.3rem' />
                <span className="font-semibold text-sm">Personas</span>
              </div>
            </Link>
            <Link href="/metodo-pago" aria-current={isActive('/metodo-pago') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/metodo-pago') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <HiCurrencyDollar size='1.3rem' />
                <span className="font-semibold text-sm">Métodos de pago</span>
              </div>
            </Link>
            <Link href="/tarjetas" aria-current={isActive('/tarjetas') ? 'page' : undefined}>
              <div className={`h-10 rounded-md flex py-1.5 px-3 items-center gap-3 ${isActive('/tarjetas') ? 'bg-primary/20 text-primary' : 'text-subtitle hover:bg-primary/10 hover:text-primary'}`}>
                <HiCreditCard size='1.3rem' />
                <span className="font-semibold text-sm">Tarjetas</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </aside >
  )
}

