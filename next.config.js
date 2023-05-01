/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
	},
	images: {
		domains: ['t.htvncdn.net']
	},
	async rewrites() {
		return [
			{
				source: '/',
				destination: '/main',
			},
		]
	}
}

module.exports = nextConfig
