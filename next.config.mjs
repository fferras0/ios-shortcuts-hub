/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const repoName = 'ios-shortcuts-hub';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
