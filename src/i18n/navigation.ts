import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const {
  Link,
  usePathname,
  useRouter,
  getPathname,
  redirect: intlRedirect,
} = createNavigation(routing)

export function redirect(...args: Parameters<typeof intlRedirect>): never {
  return intlRedirect(...args)
}
