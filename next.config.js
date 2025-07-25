// next.config.js
/*const { PHASE_PRODUCTION_SERVER } = require('next/constants');
const sendRequest = require('./pages/api/b365/sendRequest.ts'); 

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    // Run the sendRequest function when the server starts in production mode
    sendRequest();
  }

  return {
    ...defaultConfig,
    images: {
      domains: ['i.ibb.co'],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
};*/



/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
