'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormDataSchema } from '~/lib/schema'
import { Label } from './ui/label'
import { DateTimePicker } from './ui/datetime-picker'
import { Input } from './ui/input'


type Inputs = z.infer<typeof FormDataSchema>

export const RfhZod = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  })

  const [submittedData, setSubmittedData] =  useState<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    reset
    setSubmittedData(data)
  }

console.log("errors", errors) ;
console.log("wacth", watch('scheduledDeparture'))

  return (
    <section className='flex gap-6'>
    <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="scheduledDeparture" className="text-right">
            Departure
        </Label>
        <DateTimePicker 
            isRequired 
            onChange={(value) => {
        setValue('scheduledDeparture', {
                year: value.year, // Provide an initializer for the 'year' property
                identifier: '',
                era: '',
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
        }, { shouldValidate: true });
    }}
            onBlur={() => trigger('scheduledDeparture')}
            granularity="second" 
        />
        {errors.scheduledDeparture?.message && <p className='text-sm text-red-400'>{errors.scheduledDeparture.message}</p>}

    <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scheduledArrival" className="text-right">
              Arrival
            </Label>
            <DateTimePicker
             isRequired 
             onChange={(value) => {
         setValue('scheduledArrival', {
                 year: value.year, // Provide an initializer for the 'year' property
                 identifier: '',
                 era: '',
                 month: 0,
                 day: 0,
                 hour: 0,
                 minute: 0,
                 second: 0,
                 millisecond: 0
         }, { shouldValidate: true });
     }}
             onBlur={() => trigger('scheduledDeparture')}
            
            granularity="second" />
          </div>
{errors.scheduledArrival?.message && <p className='text-sm text-red-400'>{errors.scheduledArrival.message}</p>}
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portOfLoading" className="text-right">
              Port of loading
            </Label>
            <Input  {...register('portOfLoading')} />
        {errors.portOfLoading?.message && <p className='text-sm text-red-400'>{errors.portOfLoading.message}</p>}
    
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portOfDischarge" className="text-right">
              Port of discharge
            </Label>
            <Input  {...register('portOfDischarge')} />
        {errors.portOfDischarge?.message && <p className='text-sm text-red-400'>{errors.portOfDischarge.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vessel" className="text-right">
              Vessel
            </Label>
            <Input  {...register('vessel')} />
        {errors.vessel?.message && <p className='text-sm text-red-400'>{errors.vessel.message}</p>}

            </div>

     
       
      <button type="submit">Submit</button>

      {submittedData && (
        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
      )}
    </form>
    </section>
  )
}