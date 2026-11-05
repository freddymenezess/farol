import { z } from "zod"

export const personalSchema = z.object({
  firstName: z.string().min(1),
  middleNames: z.string().optional(),
  lastName: z.string().min(1),
})

export const locationSchema = z.object({
  countryCode: z.string().min(1),
  regionId: z.string().uuid(),
  cityId: z.string().uuid(),
})

export const migrationSchema = z.object({
  destinationCityId: z.string().uuid(),
  purpose: z.enum(["work", "study"]),
  expectedDate: z.iso.date().optional(),
})