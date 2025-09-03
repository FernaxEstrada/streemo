'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import TextField from '@/components/TextField'
import { Button } from '@/components/Button'
import { apiClient } from '@/lib/apiClient'
import { useFetch } from '@/hooks/useFetch'

export default function FormUsuario({ selected, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { idPersona: '', usuario: '', contrasena: '', nuevaContrasena: '' }
  })
  const { data: { personas }, solicitudApi } = useFetch()

  // cargar personas para registrar
  useEffect(() => {
    if (!personas) solicitudApi('persona', 'personas')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personas])

  // reset segun selección
  useEffect(() => {
    if (selected) {
      reset({ idPersona: selected.idpersona || '', usuario: selected.usuario || '', contrasena: '', nuevaContrasena: '' })
    } else {
      reset({ idPersona: '', usuario: '', contrasena: '', nuevaContrasena: '' })
    }
  }, [selected, reset])

  const onSubmit = async (values) => {
    if (selected && selected.idpersona) {
      // Actualizar nombre de usuario si cambió
      if (values.usuario && values.usuario !== selected.usuario) {
        const r1 = await apiClient(`/usuario/${selected.idpersona}/nombre`, {
          method: 'PATCH',
          body: JSON.stringify({ nuevoUsuario: values.usuario })
        })
        if (r1.error) return toast.error(r1.msg)
      }
      // Actualizar contraseña si se ingresó
      if (values.nuevaContrasena) {
        const r2 = await apiClient(`/usuario/${selected.idpersona}/contrasena`, {
          method: 'PATCH',
          body: JSON.stringify({ nuevaContrasena: values.nuevaContrasena })
        })
        if (r2.error) return toast.error(r2.msg)
      }
      toast.success('Usuario actualizado')
      onSaved?.()
    } else {
      // Registrar usuario
      const { idPersona, usuario, contrasena } = values
      if (!idPersona) return toast.error('Seleccione una persona')
      const { error, msg } = await apiClient('/usuario', {
        method: 'POST',
        body: JSON.stringify({ idPersona, usuario, contrasena })
      })
      if (error) return toast.error(msg)
      toast.success(msg)
      onSaved?.()
    }
  }

  const onToggleEstado = async () => {
    if (!selected?.idpersona) return
    const nuevoEstado = !selected.estado
    const { error, msg } = await apiClient(`/usuario/${selected.idpersona}/estado`, {
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
        <h3 className='text-title text-base font-semibold'>Usuario</h3>
        <p className='text-subtitle text-sm'>{selected ? 'Editar usuario' : 'Registrar nuevo usuario'}</p>
      </div>

      {!selected && (
        <div className='relative space-y-1 w-full'>
          <label className='block text-subtitle text-sm' htmlFor='idPersona'>Persona</label>
          <select
            id='idPersona'
            className='w-full rounded-md text-title outline-none placeholder-title/70 bg-card border border-border text-sm px-4 py-2.5'
            {...register('idPersona', { required: { value: true, message: 'Campo obligatorio' } })}
          >
            <option value='' disabled>Selecciona persona</option>
            {personas?.map(p => (
              <option key={p.idpersona} value={p.idpersona}>
                {p.nombres} {p.apellidos} • {p.telefono}
              </option>
            ))}
          </select>
          <p className={`${errors && errors['idPersona']?.message ? 'visible' : 'invisible'} text-sm text-error phone:mx-auto w-full`}>
            {errors['idPersona']?.message || 'sin observacion'}
          </p>
        </div>
      )}

      <TextField id='usuario' label='Usuario' placeholder='Usuario' type='text' message='Campo obligatorio' register={register} errors={errors} />

      {!selected && (
        <TextField id='contrasena' label='Contraseña' placeholder='Contraseña' type='password' message='Campo obligatorio' register={register} errors={errors} />
      )}

      {selected && (
        <TextField id='nuevaContrasena' label='Nueva contraseña' placeholder='Nueva contraseña' type='password' message='Opcional' register={register} errors={errors} />
      )}

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
