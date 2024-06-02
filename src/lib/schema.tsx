import { z } from 'zod'

export const FormDataSchema = z.object({
    portOfLoading: z.string().nonempty('Port of Loading is required.'),
    portOfDischarge: z.string().nonempty('Port of Discharge is required.'),
    vessel: z.string().nonempty('Vessel is required.'),
    scheduledDeparture: z.string().nonempty('Scheduled Departure is required.'),
    scheduledArrival: z.string().nonempty('Scheduled Arrival is required.'),
})
 
