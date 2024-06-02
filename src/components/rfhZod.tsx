'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormDataSchema } from '~/lib/schema'
import { Label } from './ui/label'
import { DateTimePicker } from './ui/datetime-picker'
import { Input } from './ui/input'


import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'

type Inputs = z.infer<typeof FormDataSchema>

export const RfhZod = () => {
  const formData = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  })


function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data", data)   
    }


  return (
    <section className='flex gap-6'>
        <Form {...formData}>
    <form onSubmit={formData.handleSubmit(onSubmit)}>

<FormField
          control={formData.control}
          name="scheduledDeparture"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="scheduledDeparture">scheduledDeparture</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="second"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formData.control}
          name="scheduledArrival"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="scheduledArrival">scheduledArrival</FormLabel>
              <FormControl>
                <DateTimePicker
                  granularity="second"
                  jsDate={field.value}
                  onJsDateChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {formData.formState.scheduledDeparture?.message && <p className='text-sm text-red-400'>{formData.formState.scheduledDeparture.message}</p>}

              <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portOfLoading" className="text-right">
              Port of loading
            </Label>
            <Input  {...formData.register('portOfLoading')} />
        {formData.formState.portOfLoading?.message && <p className='text-sm text-red-400'>{formData.formState.portOfLoading.message}</p>}
    
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="portOfDischarge" className="text-right">
              Port of discharge
            </Label>
            <Input  {...formData.register('portOfDischarge')} />
        {formData.formState.portOfDischarge?.message && <p className='text-sm text-red-400'>{formData.formState.portOfDischarge.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vessel" className="text-right">
              Vessel
            </Label>
            <Input  {...formData.register('vessel')} />
        {formData.formState.vessel?.message && <p className='text-sm text-red-400'>{formData.formState.vessel.message}</p>}
            </div>
    
      <button type="submit">Submit</button>
    </form>
    </Form>
    </section>
  )
}