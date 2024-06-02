import { z } from "zod";

export const FormDataSchema = z
  .object({
    scheduledDeparture: z.date().nullable(),
    scheduledArrival: z.date().nullable(),
    portOfLoading: z.string().nonempty("Port of Loading is required."),
    portOfDischarge: z.string().nonempty("Port of Discharge is required."),
    vessel: z.string().nonempty("Vessel is required."),
  })
  .refine(
    (data) => {
      // If both dates are not null and arrival is before departure
      if (
        data.scheduledDeparture &&
        data.scheduledArrival &&
        data.scheduledArrival < data.scheduledDeparture
      ) {
        return false; // Return false means validation failed
      }
      return true; // Return true means validation passed
    },
    {
      // Custom error message
      message: "Scheduled Arrival should be after Scheduled Departure",
      path: ["scheduledArrival"], // This is to indicate which field the error is related to
    },
  );
