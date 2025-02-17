const path = require("path");
const webpackTools = require("@dev/build-tools").webpackTools;

// Make sure to run:
// npm run build -w babylonjs-viewer-assets -- --watch
// to watch assets (if needed)

module.exports = (env) => {
    env = env || {};
    const source = env.source || "dev";
    const production = env.mode === "production";
    return {
        entry: {
            viewer: "./src/index.ts",
            renderOnlyViewer: "./src/renderOnlyIndex.ts",
        },
        ...webpackTools.commonDevWebpackConfiguration({
            mode: env.mode,
        }),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js",
            library: "BabylonViewer",
            devtoolModuleFilenameTemplate: production ? "webpack://[namespace]/[resource-path]?[loaders]" : "file:///[absolute-resource-path]",
        },
        resolve: {
            extensions: [".js", ".ts"],
            alias: {
                core: `@${source}/core/dist`,
                loaders: `@${source}/loaders/dist`,
                handlebars: "handlebars/dist/handlebars.js",
                "babylonjs-viewer-assets": path.resolve(__dirname, "../../public/babylonjs-viewer-assets/dist/babylon.viewer.assets.js"),
            },
            symlinks: false,
        },
        externals: {
            fs: true,
        },
        module: {
            rules: webpackTools.getRules({
                sideEffects: true,
                includeCSS: true,
            }),
        },
        ignoreWarnings: [/Failed to parse source map/],
        devServer: {
            client: {
                overlay: process.env.DISABLE_DEV_OVERLAY
                    ? false
                    : {
                          warnings: false,
                          errors: true,
                      },
            },
            static: {
                directory: path.join(__dirname, "public"),
            },
            compress: false,
            //open: true,
            port: 1338,
            server: env.enableHttps !== undefined || process.env.ENABLE_HTTPS === "true" ? "https" : "http",
            hot: (env.enableHotReload !== undefined || process.env.ENABLE_HOT_RELOAD === "true") && !production ? true : false,
            liveReload: (env.enableLiveReload !== undefined || process.env.ENABLE_LIVE_RELOAD === "true") && !production ? true : false,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        },
    };
};
