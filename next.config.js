const path = require('path');

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  disable: process.env.NODE_ENV === "development"
});

module.exports = withPWA({
  reactStrictMode: true,
}); 