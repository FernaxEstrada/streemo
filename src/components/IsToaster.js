import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { PiSpinnerBold, PiWarning } from "react-icons/pi";
import { Toaster } from "sonner";

export default function IsToaster() {
  return (
    <Toaster
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'bg-dark flex px-4 py-3 items-center justify-start rounded-md gap-2 border-b-2 border-l-0 border-t-0 border-r-0 phone:mb-12',
          title: 'text-sm/5 font-Inter text-subtitle',
          error: 'border-error',
          success: 'border-success',
          loading: 'border-gray-400',
          warning: 'border-warning',
          info: 'border-gray-400'
        }
      }}
      icons={{
        success: <FiCheckCircle size='1.2rem' className=' text-success' />,
        error: <FiAlertCircle size='1.2rem' className=' text-error' />,
        loading: <PiSpinnerBold size='1.2rem' className='animate-spin' />,
        warning: <PiWarning size='1.2rem' className='text-warning' />,
        info: <FiInfo size='1.2rem' className=' text-gray-400' />
      }}
    />
  )
}