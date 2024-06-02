import { z } from 'zod';
 
 export const FormDataSchema = z.object({
  scheduledDeparture:z.date().nullable() ,
  scheduledArrival: z.date().nullable() ,
  portOfLoading: z.string().nonempty('Port of Loading is required.'),
  portOfDischarge: z.string().nonempty('Port of Discharge is required.'),
  vessel: z.string().nonempty('Vessel is required.'),
});