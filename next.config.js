/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
	},
	images: {
		domains: ['t.htvncdn.net', 'c4.wallpaperflare.com']
	},
	async rewrites () {
		return [
			{
				source: '/',
				destination: '/main'
			},
			{
				source: '/:path*',
				destination: '/main/:path*'
			}
		]
	}
}

module.exports = nextConfig
