/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.fitxcel.club',
                port: '',
                pathname: '/hls/thumbnails/**',
            },
        ],
    },
};

export default nextConfig;
