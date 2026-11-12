import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.188", "192.168.100.254"]
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
