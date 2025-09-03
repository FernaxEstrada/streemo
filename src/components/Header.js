'use client'
import { Button } from "@/components/Button"
import { HiLogout } from "react-icons/hi"
import { useAuth } from "@/context/AuthContext"

export default function Header({ title }) {
    const { logout } = useAuth();
    return (
        <header className="fixed w-[calc(100%-220px)] h-18 top-0 right-0 bg-dark z-10 flex flex-col items-center justify-center border-b border-border" >
            <div className="w-full flex items-center px-6 py-auto">
                <div className="flex items-center px-2 w-[85%]">
                    <h1 className="text-title text-base/none font-bold font-Manrope">{title}</h1>
                </div>
                <div className="h-auto w-[15%]">
                    <Button
                        onClick={() => logout()}
                        ico={<HiLogout size='1.2rem' />}
                        text="Cerrar sesion"
                    />
                </div>
            </div>
        </header >
    )
}