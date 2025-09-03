export default function TextField({ id, label, type, disabled, readOnly, register, errors, placeholder, message }) {
  const registerOptions =
    type === 'number'
      ? { required: { value: true, message }, setValueAs: (v) => v === '' || v == null ? 0 : Number(v) }
      : { required: { value: true, message } }
  return (
    <div className='relative space-y-1'>
      {label && <label className='block text-subtitle text-sm' htmlFor={id}>{label}</label>}
      <input
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        id={id}
        {...register(id, registerOptions)}
        placeholder={placeholder}
        className={`w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5`} />
      {message &&
        <p className={`${errors && errors[id]?.message ? 'visible' : 'invisible'} text-sm text-error phone:mx-auto w-full`}>
          {errors[id]?.message || 'sin observacion'}
        </p>
      }
    </div>
  )
}