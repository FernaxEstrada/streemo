import { useState } from "react"
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"

export default function PasswordField({ id, label, disabled, register, errors }) {
  const [isViewContrasena, setViewContrasena] = useState(false)
  return (
    <div className='space-y-1.5'>
      <div className='relative space-y-1'>
        {label && <label className='block text-subtitle text-sm' htmlFor={id}>{label}</label>}
        <input
          disabled={disabled}
          type={isViewContrasena ? 'text' : 'password'}
          id={id}
          {...register(id, { required: { value: true, message: 'Campo obligatorio' } })}
          placeholder='••••••••••••••••'
          className={`w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5`} />
        <div onClick={() => setViewContrasena(!isViewContrasena)} className='cursor-pointer text-title absolute right-4 top-[35px]'>
          {!isViewContrasena ? <HiOutlineEyeOff size='1.1rem' /> : <HiOutlineEye size='1.1rem' />}
        </div>
      </div>
      <p className={`${errors[id]?.message ? 'visible' : 'invisible'} text-sm text-error phone:mx-auto w-full`}>
        {errors[id]?.message || 'sin observacion'}
      </p>
    </div>
  )
}