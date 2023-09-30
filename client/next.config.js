/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `${process.env.NEXT_PUBLIC_DEFAULT_API_URL || ''}/:slug*`
      },
      {
        source: '/api-coin-gecko/:slug*',
        destination: `${
          process.env.NEXT_PUBLIC_DEFAULT_COIN_GECKO_API_URL || ''
        }/:slug*`
      },
      {
        source: '/api-hitbtc/:slug*',
        destination: `${
          process.env.NEXT_PUBLIC_DEFAULT_HITBTC_API_URL || ''
        }/:slug*`
      }
    ]
  }
}

module.exports = nextConfig
