/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { FormDataSchema } from "~/lib/schema";
import { DateTimePicker } from "./ui/datetime-picker";
import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { toast } from "./ui/use-toast";
import { useState } from "react";

type Inputs = z.infer<typeof FormDataSchema>;

export const RfhZod = () => {
  const [loading, setLoading] = useState(false);
  const DEFAULT_VALUE = {};

  const formData = useForm<Inputs>({
    defaultValues: DEFAULT_VALUE,
    resolver: zodResolver(FormDataSchema),
  });

  const { control, handleSubmit } = formData;

  function onSubmit(data: Inputs) {
    setLoading(true);
    console.log("data", data);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Your submitted data",
        description: (
          <>
            <p className="text-red-600">Data submitted.</p>
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          </>
        ),
      });
    }, 500);
  }

  return (
    <section className="flex gap-6">
      <Form {...formData}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={formData.control}
            name="scheduledDeparture"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="scheduledDeparture">
                  scheduledDeparture
                </FormLabel>
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
            control={control}
            name="scheduledArrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="scheduledArrival">
                  scheduledArrival
                </FormLabel>
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
            control={control}
            name="portOfLoading"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="portOfLoading">Port of loading</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="portOfDischarge"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="portOfDischarge">
                  Port of discharge
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="vessel"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="vessel">Vessel</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </Form>
    </section>
  );
};
