import { z } from "zod"

export const personalSchema = z.object({
  firstName: z.string().nonempty(),
  middleNames: z.string().optional(),
  lastName: z.string().nonempty(),
})

export const locationSchema = z.object({
  countryCode: z.uuid(),
  regionId: z.uuid(),
  cityId: z.uuid(),
})

export const migrationSchema = z.object({
  destinationCityId: z.uuid(),
  purpose: z.enum(["work", "study"]),
  expectedDate: z.iso.date().optional(),
})