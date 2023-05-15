/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
	},
	images: {
		domains: ['t.htvncdn.net', 'c4.wallpaperflare.com', 't3.nhentai.net', 'qoulqaz.aipkdqbalngb.hath.network', 'localhost']
	},
	async rewrites () {
		return [
			{
				source: '/',
				destination: '/main'
			},
			{
				source: '/chat/:path*',
				destination: '/chat/:path*'
			},
			{
				source: '/:path*',
				destination: '/main/:path*'
			}
		]
	}
}

module.exports = nextConfig
