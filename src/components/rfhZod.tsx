/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Controller } from "react-hook-form"; // Import the Controller component from the 'react-hook-form' package

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
import { type VesselsType } from "~/pages/api/unitType/getAll";

import { toast } from "./ui/use-toast";
import { useState } from "react";
import { Select } from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { fetchData } from "~/utils";
import { Checkbox } from "./ui/checkbox";

type Inputs = z.infer<typeof FormDataSchema>;
type UnitType = Pick<VesselsType, keyof VesselsType>;
type UnitTypesMap = Record<string, UnitType[]>;

export const RfhZod = () => {
  const [loading, setLoading] = useState(false);

  const DEFAULT_VALUE: Inputs = {
    departure: null,
    arrival: null,
    portOfLoading: "",
    portOfDischarge: "",
    vessel: "",
    unitTypes: [],
  };

  const { data: unitTypes } = useQuery<UnitType>({
    queryKey: ["unitTypes"],

    queryFn: () => fetchData("unitType/getAll"),
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

  const handleCreate = (data: Inputs) => {
    createVoyageMutation.mutate(data);
  };

  function onSubmit(data: Inputs) {
    setLoading(true);
    console.log("data", data);
    const unitTypes = data?.unitTypes ?? [];
    data.unitTypes = unitTypes;
    handleCreate(data);
    setLoading(false);
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
          <button type="submit">Submit</button>
        </form>
      </Form>
    </section>
  );
};
