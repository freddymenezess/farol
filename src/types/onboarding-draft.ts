export type OnboardingData = {
  personal?: {
    firstName: string
    middleNames?: string
    lastName: string
  }

  location?: {
    countryCode: string
    regionId: string
    cityId: string
  }

  migration?: {
    destinationCityId: string
    purpose: "work" | "study"
    expectedDate?: string
  }
}