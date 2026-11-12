import Image from "next/image"

export function Logo({ className }: { className?: string }) {
  return <Image src="/farol.png" alt="Farol Logo" width={100} height={70} className={className} />
}
