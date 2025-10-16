import process from "node:process";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

/**
 * Shared Vite Configuration
 *
 * This configuration contains common build and development settings
 * that are shared across both the application and test environments.
 *
 * The vitest.config.ts extends this configuration to add test-specific options.
 *
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    // ============================================================================
    // PLUGINS
    // ============================================================================
    plugins: [

        /**
         * Node.js Polyfills for Browser Environment
         * Provides compatibility for Node.js built-in modules in the browser
         * Only includes essential polyfills to keep bundle size minimal
         */
        nodePolyfills({
            /**
             * Modules to polyfill
             * Only include what's necessary for your application
             */
            include: ["buffer", "process", "stream"],

            /**
             * Global variable polyfills
             * Makes Buffer and process available globally
             */
            globals: {
                Buffer: true,
                global: false,
                process: true,
            },

            /**
             * Disable node: protocol imports
             * Prevents polyfilling of 'node:*' style imports
             */
            protocolImports: false,
        }),
    ],

    // ============================================================================
    // DEPENDENCY OPTIMIZATION
    // ============================================================================
    optimizeDeps: {
        /**
         * Dependencies to force optimize during dev
         * Add packages that need pre-bundling for better performance
         */
        include: [
            // Add frequently used dependencies here
            // Example: 'lodash-es', 'date-fns'
        ],

        /**
         * Dependencies to exclude from optimization
         * fsevents is macOS-specific and shouldn't be bundled
         */
        exclude: ["fsevents"],

        /**
         * Additional entries to scan for dependencies
         * Useful when Vite can't auto-detect all entry points
         */
        // entries: [],

        /**
         * Force re-optimize dependencies even if cached
         * @default false
         */
        // force: false,

        /**
         * Enable dependency optimization for SSR builds
         */
        // needsInterop: [],
    },

    // ============================================================================
    // MODULE RESOLUTION
    // ============================================================================
    resolve: {
        /**
         * Path aliases for cleaner imports
         * @example
         * import { Component } from '@/components/Component'
         * import utils from '@utils/helper'
         */
        alias: {
            // '@': new URL('./src', import.meta.url).pathname,
            // '@components': new URL('./src/components', import.meta.url).pathname,
            // '@utils': new URL('./src/utils', import.meta.url).pathname,
        },

        /**
         * Extensions to try when resolving imports without extensions
         * @default ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
         */
        extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],

        /**
         * Conditions for package.json exports field resolution
         * Controls which export conditions are used when resolving packages
         */
        conditions: ["browser", "module", "import", "default"],

        /**
         * Fields in package.json to check when resolving a package's entry point
         */
        mainFields: ["browser", "module", "jsnext:main", "jsnext"],

        /**
         * Whether to preserve symlinks when resolving files
         * @default false
         */
        preserveSymlinks: false,

        /**
         * Custom resolvers for specific imports
         */
        // dedupe: [],
    },

    // ============================================================================
    // CSS CONFIGURATION
    // ============================================================================
    css: {
        /**
         * CSS Modules configuration
         */
        modules: {
            /**
             * Class name generation strategy
             * - 'stable': Generates consistent class names across builds
             * - undefined: Generates hashed class names
             */
            // generateScopedName: '[name]__[local]___[hash:base64:5]',

            /**
             * Locals convention for CSS modules
             * Controls how class names are transformed when imported
             * - 'camelCase': .foo-bar → fooBar
             * - 'camelCaseOnly': .foo-bar → fooBar (no original)
             * - 'dashes': .foo-bar → foo-bar and fooBar
             * - 'dashesOnly': .foo-bar → foo-bar (no camelCase)
             */
            localsConvention: "camelCase",
        },

        /**
         * CSS preprocessor options
         * Configuration for Sass, Less, Stylus, etc.
         */
        // preprocessorOptions: {
        //     scss: {
        //         additionalData: `@import "@/styles/variables.scss";`,
        //     },
        //     less: {
        //         math: 'parens-division',
        //     },
        // },

        /**
         * PostCSS configuration
         * Can be a string path to config file or inline config
         */
        // postcss: {},

        /**
         * Enable CSS source maps
         */
        devSourcemap: true,
    },

    // ============================================================================
    // BUILD CONFIGURATION
    // ============================================================================
    build: {
        /**
         * Output directory for production build
         * @default 'dist'
         */
        outDir: "dist",

        /**
         * Directory for static assets
         * @default 'assets'
         */
        assetsDir: "assets",

        /**
         * Inline assets smaller than this limit (in bytes) as base64
         * @default 4096 (4kb)
         */
        assetsInlineLimit: 4096,

        /**
         * Enable CSS code splitting
         * Creates separate CSS files for async chunks
         * @default true
         */
        cssCodeSplit: true,

        /**
         * Generate source maps for production
         * Options: false | true | 'inline' | 'hidden'
         * @default false
         */
        sourcemap: process.env.NODE_ENV === "development",

        /**
         * Target browsers for build output
         * @default 'modules' (browsers that support ES modules)
         */
        target: "modules",

        /**
         * Minification options
         * - 'esbuild': Fast, good for most cases
         * - 'terser': More aggressive, slower
         * - false: No minification
         * @default 'esbuild'
         */
        minify: "esbuild",

        /**
         * Rollup-specific options
         */
        rollupOptions: {
            /**
             * Output configuration
             */
            output: {
                /**
                 * Chunk naming strategy
                 * Controls how code-split chunks are named
                 */
                chunkFileNames: "assets/js/[name]-[hash].js",
                entryFileNames: "assets/js/[name]-[hash].js",
                assetFileNames: "assets/[ext]/[name]-[hash].[ext]",

                /**
                 * Manual chunk splitting
                 * Groups dependencies into separate chunks for better caching
                 */
                manualChunks: id => {
                    if (id.includes("node_modules")) {
                        // Split vendor dependencies into separate chunk
                        return "vendor";
                    }
                },
            },
        },

        /**
         * Chunk size warning limit (in kb)
         * @default 500
         */
        chunkSizeWarningLimit: 1000,

        /**
         * Empty outDir before build
         * @default true if outDir is inside root
         */
        emptyOutDir: true,

        /**
         * Copy public directory to outDir
         * @default true
         */
        // copyPublicDir: true,

        /**
         * Report compressed size
         * Can slow down large builds
         * @default true
         */
        reportCompressedSize: true,

        /**
         * Write bundle to disk
         * @default true
         */
        write: true,
    },

    // ============================================================================
    // DEV SERVER CONFIGURATION
    // ============================================================================
    server: {
        /**
         * Server host
         * - 'localhost': Only accessible locally
         * - '0.0.0.0': Accessible on network
         * @default 'localhost'
         */
        host: "localhost",

        /**
         * Server port
         * @default 5173
         */
        port: 3000,

        /**
         * Fail if port is already in use
         * @default false
         */
        strictPort: false,

        /**
         * Enable HTTPS
         */
        // https: false,

        /**
         * Open browser on server start
         * @default false
         */
        open: false,

        /**
         * CORS configuration
         * @default false
         */
        // cors: true,

        /**
         * Proxy API requests
         * Useful for avoiding CORS issues in development
         */
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:8080',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, ''),
        //     },
        // },

        /**
         * Hot Module Replacement configuration
         */
        hmr: {
            /**
             * Show HMR overlay on errors
             * @default true
             */
            overlay: true,

            /**
             * Custom HMR server configuration
             */
            // protocol: 'ws',
            // host: 'localhost',
            // port: 24678,
        },

        /**
         * Watch options for file system changes
         */
        watch: {
            /**
             * Ignore patterns for file watching
             */
            // ignored: ['**/node_modules/**', '**/.git/**'],

            /**
             * Use polling for file watching
             * Useful in containers or network file systems
             */
            // usePolling: false,
        },

        /**
         * Pre-transform and cache files to speed up initial page load
         * Only include frequently-used, heavy files
         */
        // warmup: {
        //     clientFiles: ['./src/components/*.{ts,tsx}', './src/utils/heavy-utils.ts'],
        // },

        /**
         * File system access restrictions
         * Controls which files can be served
         */
        fs: {
            /**
             * Restrict files that can be served outside of root
             * @default true
             */
            strict: true,

            /**
             * Allowed directories outside of root
             */
            // allow: ['..'],

            /**
             * Files to deny serving
             */
            // deny: ['.env', '.env.*', '*.{pem,crt}'],
        },
    },

    // ============================================================================
    // PREVIEW SERVER CONFIGURATION
    // ============================================================================
    preview: {
        /**
         * Preview server port
         * @default 4173
         */
        port: 4173,

        /**
         * Preview server host
         */
        host: "localhost",

        /**
         * Fail if port is already in use
         */
        strictPort: false,

        /**
         * Open browser on preview start
         */
        open: false,

        /**
         * CORS configuration
         */
        // cors: true,

        /**
         * Proxy configuration (same as server.proxy)
         */
        // proxy: {},
    },

    // ============================================================================
    // ENVIRONMENT VARIABLES
    // ============================================================================

    /**
     * Prefix for environment variables exposed to client
     * Only variables with this prefix are exposed via import.meta.env
     * @default 'VITE_'
     */
    envPrefix: "VITE_",

    /**
     * Directory containing .env files
     * @default root
     */
    // envDir: process.cwd(),

    /**
     * Define global constant replacements
     * Values are JSON stringified
     */
    define: {
        // __APP_VERSION__: JSON.stringify('v1.0.0'),
        // __API_URL__: JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
    },

    // ============================================================================
    // LOGGING
    // ============================================================================

    /**
     * Log level
     * Options: 'info' | 'warn' | 'error' | 'silent'
     * @default 'info'
     */
    logLevel: "info",

    /**
     * Clear screen when starting dev server
     * @default true
     */
    clearScreen: true,

    /**
     * Custom logger
     */
    // customLogger: {},

    // ============================================================================
    // WORKER CONFIGURATION
    // ============================================================================
    worker: {
        /**
         * Output format for web workers
         * - 'es': ES modules
         * - 'iife': IIFE for better compatibility
         * @default 'iife'
         */
        format: "iife",

        /**
         * Worker plugin configuration
         */
        // plugins: [],

        /**
         * Rollup options for worker bundles
         */
        // rollupOptions: {},
    },

    // ============================================================================
    // ESBUILD CONFIGURATION
    // ============================================================================
    esbuild: {
        /**
         * JSX factory function
         * @default 'React.createElement'
         */
        // jsxFactory: 'h',

        /**
         * JSX fragment
         * @default 'React.Fragment'
         */
        // jsxFragment: 'Fragment',

        /**
         * Drop console statements in production
         */
        drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],

        /**
         * Target ES version
         */
        // target: 'es2020',
    },

    // ============================================================================
    // PERFORMANCE
    // ============================================================================

    /**
     * Base public path
     * Use when deploying to a subdirectory
     * @default '/'
     */
    base: "/",

    /**
     * Public directory
     * Static assets in this directory are served at root path
     * @default 'public'
     */
    publicDir: "public",

    /**
     * Cache directory for Vite
     * @default 'node_modules/.vite'
     */
    cacheDir: "node_modules/.vite",
});
