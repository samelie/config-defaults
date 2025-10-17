import { defineKnipConfig } from "./src/knip.config.js";

export default defineKnipConfig({
    entry: [
        // Build configuration - builds and bundles library exports
        // "build.config.ts",
        "./src/*.ts",
    ],
    project: [
        // Include all TypeScript source files
        "src/**/*.ts",

        // Include build and configuration files
        "build.config.ts",
        "knip.config.ts",

        // Exclude built artifacts
        "!dist/**",
    ],
    ignore: [
        // Ignore built artifacts
        "dist/**",
    ],
    // Don't report unused exports in entry files (consumed by external packages)
    includeEntryExports: false,
    rules: {
        // shame, this doesn't seem to work.
        // the imports in apps/rad/src are not being recognized
        dependencies: "off", // Report unused dependencies as errors
        files: "off", // Report files that aren't imported anywhere
        exports: "off", // Report exports not used in other files
    },
});
