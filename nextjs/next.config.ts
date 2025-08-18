import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    devIndicators: false,

    experimental: {
        inlineCss: true
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp'
                    }
                ]
            }
        ];
    },

    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                cn: 'classnames'
            })
        );

        return config;
    }
};

export default nextConfig;
