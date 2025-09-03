'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'

export default function FormPersonaGeneral({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { nombres: '', apellidos: '', telefono: '', sexo: '', tipoap: false, tipoc: true, tiposa: false }
  })

  useEffect(() => {
    if (selected) {
      reset({
        nombres: selected.nombres || '',
        apellidos: selected.apellidos || '',
        telefono: selected.telefono || '',
        sexo: selected.sexo || '',
        tipoap: !!selected.tipoap,
        tipoc: selected.tipoc === undefined ? true : !!selected.tipoc,
        tiposa: !!selected.tiposa
      })
    } else {
      reset({ nombres: '', apellidos: '', telefono: '', sexo: '', tipoap: false, tipoc: true, tiposa: false })
    }
  }, [selected, reset])

  const onSubmit = async (values) => {
    if (selected && selected.idpersona) {
      // Actualizar datos personales y roles
      const { tipoap, tipoc, tiposa, ...datos } = values
      const upd = await apiClient(`/persona/${selected.idpersona}/actualizar`, {
        method: 'PUT',
        body: JSON.stringify(datos)
      })
      if (upd.error) return toast.error(upd.msg)
      const rol = await apiClient(`/persona/${selected.idpersona}/roles`, {
        method: 'PATCH',
        body: JSON.stringify({ tipoap, tipoc, tiposa })
      })
      if (rol.error) return toast.error(rol.msg)
      toast.success('Persona y roles actualizados')
      onSaved?.()
    } else {
      // Crear
      const { error, msg } = await apiClient('/persona', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      if (error) return toast.error(msg)
      toast.success(msg)
      onSaved?.()
    }
  }

  const onToggleEstado = async () => {
    if (!selected?.idpersona) return
    const nuevoEstado = !selected.estado
    const { error, msg } = await apiClient(`/persona/${selected.idpersona}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: nuevoEstado })
    })
    if (error) return toast.error(msg)
    toast.success(msg)
    onSaved?.()
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
      <div>
        <h3 className='text-title text-base font-semibold'>Persona</h3>
        <p className='text-subtitle text-sm'>{selected ? 'Editar datos' : 'Registrar nueva persona'}</p>
      </div>

      <TextField id='nombres' label='Nombres' placeholder='Nombres' type='text' message='Campo obligatorio' register={register} errors={errors} />
      <TextField id='apellidos' label='Apellidos' placeholder='Apellidos' type='text' message='Campo obligatorio' register={register} errors={errors} />

      <div className='flex gap-2'>
        <TextField id='telefono' label='Teléfono' placeholder='Teléfono' type='text' message='Campo obligatorio' register={register} errors={errors} />
        <div className='relative space-y-1 w-full'>
          <label className='block text-subtitle text-sm' htmlFor='sexo'>Sexo</label>
          <select
            id='sexo'
            className='w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5'
            {...register('sexo', { required: { value: true, message: 'Campo obligatorio' } })}
          >
            <option value='' disabled>Selecciona</option>
            <option value='M'>M</option>
            <option value='F'>F</option>
          </select>
          <p className={`${errors && errors['sexo']?.message ? 'visible' : 'invisible'} text-sm text-error phone:mx-auto w-full`}>
            {errors['sexo']?.message || 'sin observacion'}
          </p>
        </div>
      </div>

      <div className='relative space-y-2'>
        <h4 className='text-subtitle text-sm'>Roles</h4>
        <div className='flex gap-4 text-sm text-title'>
          <label className='inline-flex items-center gap-2'>
            <input type='checkbox' className='accent-primary' {...register('tipoap')} />
            Admin Plataforma
          </label>
          <label className='inline-flex items-center gap-2'>
            <input type='checkbox' className='accent-primary' {...register('tipoc')} />
            Cliente
          </label>
          <label className='inline-flex items-center gap-2'>
            <input type='checkbox' className='accent-primary' {...register('tiposa')} />
            Super Admin
          </label>
        </div>
      </div>

      <div className='flex gap-2'>
        <Button
          type='submit'
          disabled={isSubmitting}
          loading={{ state: isSubmitting, inactive: selected ? 'Guardar cambios' : 'Registrar', active: selected ? 'Guardando' : 'Registrando' }}
        />
        <Button type='button' onClick={() => onCancel?.()} text='Cancelar' />
        {selected && (
          <Button type='button' onClick={onToggleEstado} text={selected.estado ? 'Desactivar' : 'Activar'} />
        )}
      </div>
    </form>
  )
}
