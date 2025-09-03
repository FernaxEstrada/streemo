import { PiSpinnerBold } from "react-icons/pi";

export function Button({ type, onClick, disabled, text, ico, loading }) {
    return (
        <button onClick={onClick} type={type} disabled={disabled} className={`${loading && loading.state ? 'bg-primary/50' : 'bg-primary cursor-pointer'} text-title flex text-center w-full items-center justify-center text-base font-semibold space-x-1.5 px-4 py-2 rounded-md`}>
            {loading && loading.state && <PiSpinnerBold size='1.2rem' className='animate-spin' />}
            {loading && <span>{loading.state ? loading.active : loading.inactive}</span>}
            {!loading && <span className="flex gap-2 items-center justify-center">{ico} {text}</span>}
        </button>
    )
}
