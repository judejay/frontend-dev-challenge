import { z } from 'zod';
 
 export const FormDataSchema = z.object({
  scheduledDeparture: z.object({
    identifier: z.string(),
    era: z.string(),
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
    millisecond: z.number(),
  }),
  scheduledArrival: z.object({
    identifier: z.string(),
    era: z.string(),
    year: z.number(),
    month: z.number(),
    day: z.number(),
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
    millisecond: z.number(),
  }),
  portOfLoading: z.string().nonempty('Port of Loading is required.'),
  portOfDischarge: z.string().nonempty('Port of Discharge is required.'),
  vessel: z.string().nonempty('Vessel is required.'),
});