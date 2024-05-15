/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.ytimg.com",
			},
			{
				protocol: "https",
				hostname: "www.gravatar.com",
			},
		],
	},
};

module.exports = nextConfig;
