import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-black placeholder:text-gray-500 selection:bg-[#c7f464] selection:text-black border-3 border-black h-11 w-full min-w-0 bg-white px-4 py-2 text-base font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        'aria-invalid:border-[#ff6b9d] aria-invalid:bg-red-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
