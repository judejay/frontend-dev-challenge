import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchData } from "~/utils";
import type { ReturnType } from "./api/voyage/getAll";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet"

import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { RfhZod } from "@/components/rfhZod";
import { useState } from "react";

export default function Home() {

  const [departure, setDeparture] = useState<Date | null>(null)
  const [arrival, setArrival] = useState<Date | null>(null)
  const [portOfLoading, setPortOfLoading] = useState<string>("")
  const [portOfDischarge, setPortOfDischarge] = useState<string>("")
  const [vessel, setVessel] = useState<string>("")
  
  const { data: voyages } = useQuery<ReturnType>({
    queryKey: ["voyages"],

    queryFn: () =>
      fetchData("voyage/getAll")
  });


  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the voyage");
      }
    },
   	onSuccess: async () => {
        await queryClient.invalidateQueries(["voyages"] as InvalidateQueryFilters);
      },
    }
  );

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(departure, arrival, portOfLoading, portOfDischarge, vessel);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Voyage</SheetTitle>
          <SheetDescription>
            Create a voyage here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <RfhZod />
       </div>        
        <SheetFooter>
          
        </SheetFooter>
      </SheetContent>
</Sheet>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
