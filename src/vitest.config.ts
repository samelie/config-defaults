import type { ViteUserConfig } from "vitest/config";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";

import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * Vitest Configuration
 *
 * This configuration extends the base vite.config.ts with test-specific options.
 * It inherits plugins, resolve aliases, and optimization settings from the Vite config
 * while adding comprehensive browser and unit testing configuration.
 *
 * @see https://vitest.dev/config/
 */
export default mergeConfig(
    viteConfig as ViteUserConfig,
    defineConfig({
        test: {
            // ====================================================================
            // BROWSER TESTING CONFIGURATION
            // ====================================================================
            browser: {
                /**
                 * Enable browser testing mode
                 * @default false
                 */
                enabled: true,

                /**
                 * Browser provider - handles browser automation
                 * Options: playwright(), webdriverio(), preview()
                 * @see https://vitest.dev/guide/browser/
                 */
                provider: playwright({
                    // Playwright-specific options can be passed here
                    // launchOptions: {
                    //     slowMo: 50,
                    //     channel: 'chrome-beta',
                    // },
                    // actionTimeout: 5_000,
                }),

                /**
                 * Run browser in headless mode
                 * Set to false for debugging (shows actual browser window)
                 * @default true
                 */
                headless: process.env.HEADLESS !== "false",

                /**
                 * Run each test file in isolation (separate browser context)
                 * Prevents state leakage between test files
                 * @default true
                 */
                isolate: true,

                /**
                 * Run browser test files in parallel
                 * Set to false to run sequentially (useful for debugging)
                 * @default true
                 */
                fileParallelism: true,

                /**
                 * Browser instances - define multiple browsers and configurations
                 * Each instance can have its own browser, viewport, and settings
                 */
                instances: [
                    {
                        /**
                         * Browser name: 'chromium', 'firefox', 'webkit'
                         */
                        browser: "chromium",

                        /**
                         * Optional name for this instance (used in project filtering)
                         * @example vitest --project=chromium-desktop
                         */
                        // name: 'chromium-desktop',

                        /**
                         * Viewport size for this browser instance
                         */
                        viewport: { width: 1280, height: 720 },

                        /**
                         * Browser-specific setup files
                         * Runs in the browser context before tests
                         */
                        // setupFile: ['./test/chromium-setup.ts'],

                        /**
                         * Provider-specific overrides for this instance
                         * Note: This does NOT merge with parent provider options
                         */
                        // provider: playwright({
                        //     launchOptions: {
                        //         args: ['--disable-gpu'],
                        //     },
                        // }),

                        /**
                         * Custom values available via inject() in tests
                         */
                        // provide: {
                        //     customValue: 'chromium-specific-value',
                        // },
                    },
                    {
                        browser: "webkit",
                        viewport: { width: 1280, height: 720 },
                    },
                    // Uncomment to also test in Firefox
                    // {
                    //     browser: "firefox",
                    //     viewport: { width: 1280, height: 720 },
                    // },
                ],

                /**
                 * Custom browser commands
                 * These become available in tests via userEvent or commands API
                 * Example usage - uncomment and create ./test/browser-commands.ts:
                 */
                // commands: {
                //     navigateTo,
                //     waitForElement,
                // },

                /**
                 * API server configuration for browser tests
                 */
                // api: {
                //     /**
                //      * Port for the test API server
                //      * @default 63315
                //      */
                //     port: 63315,
                //
                //     /**
                //      * Host address for the API server
                //      * Set to '0.0.0.0' to listen on all addresses (useful for remote testing)
                //      * @default 'localhost'
                //      */
                //     host: 'localhost',
                //
                //     /**
                //      * Strict port enforcement
                //      * If true, fails if port is already in use
                //      * @default false
                //      */
                //     strictPort: false,
                // },

                /**
                 * Screenshot assertion defaults (for toMatchScreenshot)
                 */
                // expect: {
                //     toMatchScreenshot: {
                //         /**
                //          * Image comparison algorithm
                //          * @default 'pixelmatch'
                //          */
                //         comparatorName: 'pixelmatch',
                //
                //         /**
                //          * Comparison options
                //          */
                //         comparatorOptions: {
                //             threshold: 0.2,
                //             allowedMismatchedPixels: 100,
                //         },
                //
                //         /**
                //          * Custom path resolver for screenshot files
                //          */
                //         resolveScreenshotPath: ({ arg, browserName, ext, testFileName }) =>
                //             `screenshots/${testFileName}/${arg}-${browserName}${ext}`,
                //     },
                // },

                /**
                 * Playwright trace configuration
                 * Generates trace files for debugging failed tests
                 * @see https://playwright.dev/docs/trace-viewer
                 */
                // trace: {
                //     /**
                //      * When to capture traces
                //      * - 'on': Always capture traces
                //      * - 'off': Never capture traces
                //      * - 'on-first-retry': Only on first retry
                //      * - 'on-all-retries': On all retries
                //      * - 'retain-on-failure': Keep only failed test traces
                //      * @default 'off'
                //      */
                //     mode: 'on-first-retry',
                //
                //     /**
                //      * Directory for trace files
                //      * @default '__traces__' (next to test file)
                //      */
                //     tracesDir: '.vitest-traces',
                //
                //     /**
                //      * Capture screenshots during trace
                //      * @default true
                //      */
                //     screenshots: true,
                //
                //     /**
                //      * Capture DOM snapshots and network activity
                //      * @default true
                //      */
                //     snapshots: true,
                // },

                /**
                 * Track unhandled errors in browser
                 * @default true
                 */
                trackUnhandledErrors: true,

                /**
                 * Custom HTML template for the browser test page
                 */
                // testerHtmlPath: './test/custom-tester.html',

                /**
                 * Remote browser connection (for cloud testing services)
                 */
                // connect: {
                //     wsEndpoint: process.env.PLAYWRIGHT_SERVICE_URL,
                //     options: {
                //         exposeNetwork: '<loopback>',
                //         headers: {
                //             Authorization: `Bearer ${process.env.PLAYWRIGHT_SERVICE_TOKEN}`,
                //         },
                //         timeout: 30_000,
                //     },
                // },
            },

            // ====================================================================
            // GLOBAL SETUP & TEARDOWN
            // ====================================================================

            /**
             * Global setup file - runs once before all tests (in Node.js)
             * Use for database setup, server initialization, etc.
             */
            globalSetup: join(__dirname, "./browser/global-setup.mjs"),

            /**
             * Global teardown file - runs once after all tests (in Node.js)
             */
            // globalTeardown: './test/global-teardown.ts',

            // ====================================================================
            // SETUP FILES
            // ====================================================================

            /**
             * Setup files - run before each test file
             * Browser setup runs in browser context
             * Node setup runs in Node.js context
             */
            setupFiles: [join(__dirname, "./browser/setup-browser.mjs")],

            // ====================================================================
            // TEST EXECUTION CONTROL
            // ====================================================================

            /**
             * Test timeout in milliseconds
             * Individual tests fail if they exceed this time
             * @default 5000
             */
            testTimeout: 60000,

            /**
             * Hook timeout for beforeAll/afterAll/beforeEach/afterEach
             * @default 10000
             */
            hookTimeout: 10000,

            /**
             * Teardown timeout for cleanup operations
             * @default 10000
             */
            teardownTimeout: 10000,

            /**
             * Number of times to retry failed tests
             * Useful in CI environments with flaky tests
             * @default 0
             */
            retry: process.env.CI === "true" ? 2 : 0,

            /**
             * Bail after N test failures
             * Set to 1 to stop on first failure (useful for debugging)
             * @default 0 (no bail)
             */
            // bail: 0,

            /**
             * Test execution sequence control
             */
            sequence: {
                /**
                 * Randomize test order (useful for finding test interdependencies)
                 * @default false
                 */
                shuffle: false,

                /**
                 * Randomization seed (for reproducible shuffled runs)
                 */
                // seed: 12345,

                /**
                 * Run tests concurrently
                 * @default false
                 */
                concurrent: false,

                /**
                 * Run hooks (beforeAll, afterAll, etc.) sequentially
                 * @default 'parallel'
                 */
                // hooks: 'parallel',

                /**
                 * Sequencer for custom test ordering
                 */
                // sequencer: class CustomSequencer {},
            },

            // ====================================================================
            // FILE SELECTION
            // ====================================================================

            /**
             * Test file patterns to include
             * Supports glob patterns
             */
            include: ["test/browser/**/*.browser.test.ts"],

            /**
             * Files/directories to exclude from testing
             */
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/cypress/**",
                "**/.{idea,git,cache,output,temp}/**",
                "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
                "test/unit/**", // Exclude unit tests from browser runs
            ],

            /**
             * Exclude test files from watch mode
             */
            // watchExclude: ['**/node_modules/**', '**/dist/**'],

            // ====================================================================
            // REPORTERS & OUTPUT
            // ====================================================================

            /**
             * Test reporters
             * Options: 'default', 'verbose', 'dot', 'json', 'html', 'junit', 'tap'
             * Can specify multiple reporters
             * @default 'default'
             */
            // reporters: ['default', 'json', 'html'],

            /**
             * Output file for specific reporters
             */
            // outputFile: {
            //     json: './test-results.json',
            //     html: './test-results.html',
            //     junit: './junit.xml',
            // },

            /**
             * Show diff in error messages
             * @default true
             */
            // diff: true,

            /**
             * Show full diff (not truncated)
             * @default false
             */
            // diffMaxLines: 100,

            /**
             * Silent mode - suppress console output
             * @default false
             */
            // silent: false,

            /**
             * Hide passing tests in output
             * @default false
             */
            // hideSkippedTests: false,

            /**
             * Log level for console output
             * @default 'info'
             */
            // logHeapUsage: false,

            // ====================================================================
            // COVERAGE CONFIGURATION
            // ====================================================================

            /**
             * Code coverage configuration
             * Requires @vitest/coverage-v8 or @vitest/coverage-istanbul
             */
            coverage: {
                /**
                 * Enable coverage collection
                 * @default false
                 */
                enabled: false,

                /**
                 * Coverage provider
                 * - 'v8': Fast, native Node.js coverage
                 * - 'istanbul': More accurate, slower
                 * - 'custom': Use custom provider
                 * @default 'v8'
                 */
                provider: "v8",

                /**
                 * Custom coverage provider module
                 * Only used when provider: 'custom'
                 */
                // customProviderModule: 'my-custom-coverage-provider',

                /**
                 * Coverage reporters
                 * Options: 'text', 'text-summary', 'html', 'json', 'json-summary', 'lcov', 'clover', 'cobertura'
                 */
                reporter: ["text", "json", "html", "lcov"],

                /**
                 * Reporter-specific options
                 */
                // reporterOptions: {
                //     lcov: {
                //         projectRoot: './src',
                //     },
                //     json: {
                //         file: 'coverage.json',
                //     },
                // },

                /**
                 * Directory for coverage reports
                 * @default './coverage'
                 */
                reportsDirectory: "./coverage",

                /**
                 * Files to include in coverage (both covered and uncovered)
                 * Replaces deprecated 'all' option in Vitest v4
                 * Includes all source files matching these patterns
                 */
                include: ["src/**/*.{js,ts,jsx,tsx}"],

                /**
                 * Files to exclude from coverage
                 * Applied to files that match the include pattern above
                 */
                exclude: [
                    "**/node_modules/**",
                    "**/dist/**",
                    "**/*.test.{js,ts,jsx,tsx}",
                    "**/*.spec.{js,ts,jsx,tsx}",
                    "**/*.d.ts",
                    "**/test/**",
                    "**/tests/**",
                    "**/__tests__/**",
                    "**/.{idea,git,cache,output,temp}/**",
                    "**/{vite,vitest,rollup,webpack,jest}.config.*",
                ],

                /**
                 * Exclude specific lines from coverage
                 * @example ['// istanbul ignore next', '/* istanbul ignore next *\/']
                 */
                // excludeNodeModules: true,

                /**
                 * Coverage thresholds - fail if coverage is below these values
                 * @default {} (no thresholds)
                 */
                thresholds: {
                    /**
                     * Global thresholds for all files
                     */
                    lines: 80,
                    functions: 80,
                    branches: 80,
                    statements: 80,

                    /**
                     * Per-file thresholds
                     */
                    // perFile: true,

                    /**
                     * Auto-update thresholds to current coverage
                     * Useful for gradually improving coverage
                     */
                    // autoUpdate: false,

                    /**
                     * Path-specific thresholds
                     */
                    // 'src/critical/**': {
                    //     lines: 95,
                    //     functions: 95,
                    //     branches: 95,
                    //     statements: 95,
                    // },
                },

                /**
                 * Clean coverage directory before running tests
                 * @default true
                 */
                clean: true,

                /**
                 * Clean coverage results on watch rerun
                 * @default true
                 */
                cleanOnRerun: true,

                /**
                 * Report uncovered lines
                 * @default false
                 */
                // reportOnFailure: false,

                /**
                 * Skip coverage if tests fail
                 * @default false
                 */
                // skipFull: false,

                /**
                 * Enable 100% precision for coverage
                 * @default false
                 */
                // '100': false,

                /**
                 * Watermarks for coverage coloring (high/medium/low)
                 */
                // watermarks: {
                //     statements: [50, 80],
                //     functions: [50, 80],
                //     branches: [50, 80],
                //     lines: [50, 80],
                // },
            },

            // ====================================================================
            // MOCKING & SPIES
            // ====================================================================

            /**
             * Clear all mocks between tests
             * @default false
             */
            clearMocks: true,

            /**
             * Reset all mocks between tests
             * @default false
             */
            mockReset: false,

            /**
             * Restore all mocks between tests
             * @default false
             */
            restoreMocks: true,

            /**
             * Mock timers (setTimeout, setInterval, etc.)
             * @default false
             */
            // fakeTimers: {
            //     /**
            //      * Enable fake timers
            //      */
            //     enabled: true,
            //
            //     /**
            //      * Timers to mock
            //      */
            //     toFake: [
            //         'setTimeout',
            //         'clearTimeout',
            //         'setInterval',
            //         'clearInterval',
            //         'setImmediate',
            //         'clearImmediate',
            //         'Date',
            //     ],
            //
            //     /**
            //      * Should process.nextTick() be mocked
            //      */
            //     shouldAdvanceTime: false,
            //
            //     /**
            //      * Should setImmediate be mocked
            //      */
            //     advanceTimeDelta: 20,
            // },

            // ====================================================================
            // ASSERTION CONFIGURATION
            // ====================================================================

            /**
             * Expect polling configuration (for expect.poll and expect.element)
             */
            // expect: {
            //     poll: {
            //         /**
            //          * Interval between retries (ms)
            //          * @default 50
            //          */
            //         interval: 50,
            //
            //         /**
            //          * Total timeout for polling (ms)
            //          * @default 1000
            //          */
            //         timeout: 1000,
            //     },
            // },

            // ====================================================================
            // ENVIRONMENT & GLOBALS
            // ====================================================================

            /**
             * Test environment for unit tests (not used in browser mode)
             * Options: 'node', 'jsdom', 'happy-dom', 'edge-runtime'
             * @default 'node'
             */
            // environment: 'node',

            /**
             * Environment options
             */
            // environmentOptions: {},

            /**
             * Match environment with globs
             * Useful for running different files in different environments
             */
            // environmentMatchGlobs: [
            //     ['**/*.test.tsx', 'jsdom'],
            //     ['**/*.test.ts', 'node'],
            // ],

            /**
             * Inject test APIs globally (describe, it, expect, etc.)
             * @default false
             */
            globals: false,

            /**
             * Global test context available to all tests
             */
            // globalContext: {},

            // ====================================================================
            // POOL CONFIGURATION (for unit tests)
            // ====================================================================

            /**
             * Test pool strategy for non-browser tests
             * - 'forks': Each test file runs in isolated forked process
             * - 'threads': Each test file runs in isolated worker thread
             * - 'vmForks': Each test file runs in VM fork
             * - 'vmThreads': Each test file runs in VM thread
             * @default 'forks'
             */
            // pool: 'forks',

            /**
             * Pool-specific options
             */
            // poolOptions: {
            //     forks: {
            //         /**
            //          * Maximum number of forks
            //          * @default number of CPU cores
            //          */
            //         maxForks: 4,
            //
            //         /**
            //          * Minimum number of forks
            //          * @default 1
            //          */
            //         minForks: 1,
            //
            //         /**
            //          * Fork a new process for each test file
            //          * @default true
            //          */
            //         singleFork: false,
            //
            //         /**
            //          * Isolate environment for each test file
            //          * @default true
            //          */
            //         isolate: true,
            //
            //         /**
            //          * Use worker_threads instead of child_process
            //          * @default false
            //          */
            //         useAtomics: false,
            //     },
            //
            //     threads: {
            //         /**
            //          * Maximum number of threads
            //          */
            //         maxThreads: 4,
            //
            //         /**
            //          * Minimum number of threads
            //          */
            //         minThreads: 1,
            //
            //         /**
            //          * Thread isolation
            //          */
            //         isolate: true,
            //
            //         /**
            //          * Single thread mode
            //          */
            //         singleThread: false,
            //     },
            // },

            // ====================================================================
            // WATCH MODE
            // ====================================================================

            /**
             * Watch mode configuration
             */
            // watch: true,

            /**
             * Watch files even if they're not imported
             */
            // forceRerunTriggers: ['**/vitest.config.ts', '**/vite.config.ts'],

            /**
             * Watch ignored files
             */
            // watchIgnore: ['**/node_modules/**', '**/dist/**'],

            // ====================================================================
            // ADVANCED OPTIONS
            // ====================================================================

            /**
             * Root directory for resolving files
             * @default process.cwd()
             */
            // root: process.cwd(),

            /**
             * Working directory for test execution
             */
            // dir: process.cwd(),

            /**
             * Test name pattern filter
             */
            // testNamePattern: /some pattern/,

            /**
             * Isolate tests (each test file in separate environment)
             * @default true
             */
            // isolate: true,

            /**
             * Open UI for test results
             * @default false
             */
            // open: false,

            /**
             * Enable UI
             * @default false
             */
            // ui: false,

            /**
             * API server configuration
             */
            // api: {
            //     port: 51204,
            //     host: 'localhost',
            //     strictPort: false,
            // },

            /**
             * CSS handling
             * @default {}
             */
            // css: {
            //     /**
            //      * Include CSS in tests
            //      */
            //     include: [],
            //
            //     /**
            //      * Process CSS modules
            //      */
            //     modules: {
            //         classNameStrategy: 'stable',
            //     },
            // },

            /**
             * Maximum concurrency for tests
             * @default 5
             */
            // maxConcurrency: 5,

            /**
             * Maximum number of test workers
             */
            // maxWorkers: 10,

            /**
             * Minimum number of test workers
             */
            // minWorkers: 1,

            /**
             * Use different workspaces for different configurations
             */
            // workspace: './vitest.workspace.ts',

            /**
             * Inline Vite config for tests
             */
            // inline: false,

            /**
             * Run tests in browser by default
             * @default false
             */
            // browser: true,

            /**
             * Project-specific configuration
             * Allows multiple test configurations in single config file
             */
            // projects: [
            //     {
            //         test: {
            //             name: 'unit',
            //             include: ['test/unit/**/*.test.ts'],
            //             environment: 'node',
            //         },
            //     },
            //     {
            //         test: {
            //             name: 'browser',
            //             include: ['test/browser/**/*.test.ts'],
            //             browser: {
            //                 enabled: true,
            //                 provider: playwright(),
            //                 instances: [{ browser: 'chromium' }],
            //             },
            //         },
            //     },
            // ],

            /**
             * Dependency optimization
             */
            // deps: {
            //     /**
            //      * Externalize dependencies (don't bundle)
            //      */
            //     external: [],
            //
            //     /**
            //      * Inline dependencies (bundle them)
            //      */
            //     inline: [],
            //
            //     /**
            //      * Interpret CJS modules
            //      */
            //     interopDefault: true,
            //
            //     /**
            //      * Fallback CJS module
            //      */
            //     fallbackCJS: false,
            //
            //     /**
            //      * Register node loader
            //      */
            //     registerNodeLoader: false,
            //
            //     /**
            //      * Module cache directory
            //      */
            //     moduleDirectories: ['node_modules'],
            //
            //     /**
            //      * Optimizer options
            //      */
            //     optimizer: {
            //         web: {
            //             enabled: true,
            //         },
            //         ssr: {
            //             enabled: true,
            //         },
            //     },
            // },

            /**
             * Benchmark configuration (for benchmarking tests)
             */
            // benchmark: {
            //     include: ['**/*.bench.ts'],
            //     exclude: ['**/node_modules/**'],
            //     includeSource: [],
            //     reporters: ['default'],
            //     outputFile: './benchmarks.json',
            // },

            /**
             * Type checking
             */
            // typecheck: {
            //     enabled: false,
            //     checker: 'tsc',
            //     include: ['**/*.{test,spec}-d.ts'],
            //     exclude: ['**/node_modules/**'],
            // },

            /**
             * Custom test providers
             */
            // provide: {
            //     customValue: 'available via inject()',
            // },

            /**
             * Snapshot configuration
             */
            // snapshot: {
            //     /**
            //      * Snapshot directory
            //      */
            //     snapshotDirectory: '__snapshots__',
            //
            //     /**
            //      * Snapshot extension
            //      */
            //     snapshotExtension: '.snap',
            //
            //     /**
            //      * Snapshot format
            //      */
            //     snapshotFormat: {
            //         printBasicPrototype: false,
            //     },
            // },

            /**
             * Diff configuration
             */
            // diffOptions: {
            //     aColor: 'red',
            //     bColor: 'green',
            // },
        },
    }),
);
