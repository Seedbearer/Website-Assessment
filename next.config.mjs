/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The Honour Framework was renamed to the Conversation Framework — redirect old links
      // (bookmarks, already-sent emails, anything indexed) rather than letting them 404.
      {
        source: "/honour-framework",
        destination: "/conversation-framework",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
