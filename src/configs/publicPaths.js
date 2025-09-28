const { match } = require("path-to-regexp");
const publicPaths = [
  { path: "/", method: "get", exact: true },
  { path: "/about", method: "get", startsWith: true },
  { path: "/contact", method: "get", startsWith: true },
  { path: "/auth", method: "all", startsWith: true },
  { path: "/auth/login", method: "post", exact: true },
  { path: "/auth/google", method: "post", exact: true },
  { path: "/auth/github/callback", method: "get", exact: true },
  { path: "/auth/register", method: "post", exact: true },
  { path: "/auth/me", method: "get", exact: true },
  { path: "/auth/logout", method: "post", exact: true },
  { path: "/auth/verify-email", method: "get", exact: true },
  { path: "/auth/reset-password", method: "post", exact: true },
  { path: "/auth/forgot-password", method: "post", exact: true },
  { path: "/auth/verify-reset-token", method: "get", exact: true },
  { path: "/comics", method: "get", exact: true },
  { path: "/comics/all", method: "get", exact: true },
  { path: "/comics/:slug/chapter/:chapterId", method: "get", pattern: true },
  { path: "/comics/:slug", method: "get", pattern: true },
  { path: "/comics/search", method: "get", startsWith: true },
  { path: "/comics/:id", method: "get", pattern: true, startsWith: true },
  { path: "/topics", method: "get", startsWith: true },
  { path: "/profiles", method: "get", exact: true },
  { path: "/profiles/:id", method: "get", startsWith: true, pattern: true },
  { path: "/uploads", method: "get", startsWith: true },
  { path: "/chat", method: "all", startsWith: true },
];

function isPublicRoute(path, method) {
  const normalizedMethod = method.toLowerCase();
  return publicPaths.some((rule) => {
    const fullPath = rule.path;
    const methodMatch =
      rule.method === "all" || rule.method === normalizedMethod;

    if (!methodMatch) return false;
    if (rule.exact) return path === fullPath;
    if (rule.pattern) {
      const matcher = match(fullPath, { decode: decodeURIComponent });
      return matcher(path) !== false;
    }
    if (rule.startsWith) return path.startsWith(fullPath);

    return false;
  });
}

module.exports = isPublicRoute;
