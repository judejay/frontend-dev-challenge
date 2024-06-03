/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { FormDataSchema } from "~/lib/schema";
import { DateTimePicker } from "./ui/datetime-picker";
import { Input } from "./ui/input";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { UnitTypes } from "~/pages/api/unitType/getAll";

import { toast } from "./ui/use-toast";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { fetchData } from "~/utils";
import { Checkbox } from "./ui/checkbox";
import { VesselsType } from "~/pages/api/vessel/getAll";

type Inputs = z.infer<typeof FormDataSchema>;

export const RfhZod = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const [loading, setLoading] = useState(false);

  const DEFAULT_VALUE: Inputs = {
    departure: null,
    arrival: null,
    portOfLoading: "",
    portOfDischarge: "",
    vessel: "",
    unitTypes: [],
  };

  const { data: unitTypes } = useQuery<UnitTypes>({
    queryKey: ["unitTypes"],

    queryFn: () => fetchData("unitType/getAll"),
  });

  const { data: vessels } = useQuery<VesselsType>({
    queryKey: ["vessels"],

    queryFn: () => fetchData("vessel/getAll"),
  });

  const formData = useForm<Inputs>({
    defaultValues: DEFAULT_VALUE,
    resolver: zodResolver(FormDataSchema),
  });

  const { control, handleSubmit } = formData;

  const queryClient = useQueryClient();

  const createVoyageMutation = useMutation({
    mutationFn: async (data: Inputs) => {
      const response = await fetch(`/api/voyage/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          description: `Failed to create the voyage.`,
        });
        throw new Error("Failed to create the voyage");
      } else {
        toast({
          variant: "default",
          description: `Voyage successfully created.`,
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
    },
  });

  const handleCreate: (data: Inputs) => void = (data) => {
    createVoyageMutation.mutate(data);
  };

  function onSubmit(data: Inputs) {
    setLoading(true);
    console.log("data", data);
    const unitTypes = data?.unitTypes ?? [];
    data.unitTypes = unitTypes;
    handleCreate(data);
    setLoading(false);
    setOpen(false);
  }
  return (
    <section className="flex gap-6">
      <Form {...formData}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={formData.control}
            name="departure"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="departure">scheduledDeparture</FormLabel>
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
            name="arrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="arrival">scheduledArrival</FormLabel>
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
            name="unitTypes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Unit Types</FormLabel>
                  <FormLabel>Select at least five Unit Types.</FormLabel>
                </div>
                <div className="h-28 overflow-scroll">
                  {unitTypes?.map((unitType) => (
                    <FormField
                      key={unitType.id}
                      control={control}
                      name="unitTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={unitType.id}
                            className="my-2 flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(unitType.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        unitType.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) =>
                                            value !== unitType.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {unitType.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="vessel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vessel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Vessel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="-">Select a Vessel</SelectItem>
                    {vessels?.map(
                      (vessel: { value: string; label: string }) => (
                        <SelectItem key={vessel.value} value={vessel.value}>
                          {vessel.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
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
