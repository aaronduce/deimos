/**
 * @type {import('@remix-run/dev').AppConfig}
 */

const {
  createRoutesFromFolders,
} = require("@remix-run/v1-route-convention");

module.exports = {
  ignoredRouteFiles: [".*"],
  serverDependenciesToBundle: [],
  
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // devServerPort: 8002,
  
  future: {
    // makes the warning go away in v1.15+
    v2_routeConvention: true,
    v2_headers: true,
    v2_errorBoundary: false,
    v2_normalizeFormMethod: true,
    v2_dev: false,
    v2_meta: false
  },

  routes(defineRoutes) {
    // uses the v1 convention, works in v1.15+ and v2
    return createRoutesFromFolders(defineRoutes);
  },

  serverModuleFormat: "cjs",

  tailwind: true,
};
