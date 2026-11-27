"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

// Troca pelas fotos reais (emigrantes e anfitriões) em /public/images/auth/.
const slides = [
  "/images/onboarding/farol-emigrant.webp"
]

export function OnboardingCarousel() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.stop()
    }
  }, [autoplay])

  return (
    <div aria-hidden className="sticky top-0 h-svh overflow-hidden">
      <Carousel opts={{ loop: true }} plugins={[autoplay]}>
        <CarouselContent className="ml-0">
          {slides.map((src) => (
            <CarouselItem key={src} className="relative h-svh pl-0">
              <Image
                src={src}
                alt=""
                fill
                sizes="50vw"
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
