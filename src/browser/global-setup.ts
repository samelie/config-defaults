import { chromium, webkit } from "@playwright/test";
// import type { TestProject } from "vitest/node";

/**
 * Global Setup for Vitest Browser Tests
 *
 * This file runs ONCE in Node.js context before all tests start.
 * It's different from setupFiles which run in the browser before each test file.
 *
 * @see https://vitest.dev/config/#globalsetup
 * @see https://vitest.dev/guide/browser.html
 *
 * ## Current Functionality
 * - Verifies Playwright browser binaries are installed
 * - Launches and closes browsers to ensure they're working
 *
 * ## Integration Opportunities (TODO: Implement as needed)
 *
 * ### 1. Provide Context to Tests
 * You can share values across all test files using `project.provide()`.
 * Values must be JSON-serializable (no functions, classes, etc.)
 *
 * Example:
 * ```typescript
 * export default async function setup({ provide }: TestProject) {
 *     const chromiumBrowser = await chromium.launch({ headless: true });
 *
 *     provide('browserInfo', {
 *         chromiumVersion: chromiumBrowser.version(),
 *         timestamp: Date.now(),
 *     });
 *
 *     await chromiumBrowser.close();
 * }
 * ```
 *
 * Then in tests:
 * ```typescript
 * import { inject } from 'vitest';
 * const browserInfo = inject('browserInfo');
 * ```
 *
 * ### 2. Type-Safe Context (Recommended)
 * Declare types for provided context in your project:
 * ```typescript
 * declare module 'vitest' {
 *     export interface ProvidedContext {
 *         browserInfo: { chromiumVersion: string; timestamp: number };
 *         testServerPort?: number;
 *         baseUrl?: string;
 *     }
 * }
 * ```
 *
 * ### 3. Start Test Servers/Services
 * Start local servers or services needed for tests:
 * ```typescript
 * const server = await startTestServer();
 * const port = server.address().port;
 * provide('testServerPort', port);
 * provide('baseUrl', `http://localhost:${port}`);
 *
 * return async () => {
 *     await server.close();
 * };
 * ```
 *
 * ### 4. Environment-Specific Configuration
 * Provide runtime configuration based on environment:
 * ```typescript
 * const isDev = process.env.NODE_ENV === 'development';
 * provide('testConfig', {
 *     headless: process.env.HEADLESS !== 'false',
 *     slowMo: isDev ? 100 : 0,
 *     timeout: isDev ? 10000 : 5000,
 * });
 * ```
 *
 * ## Customization Guide for Consumers
 *
 * To customize this setup for your project:
 *
 * 1. Copy this file to your project (e.g., `test/global-setup.ts`)
 * 2. Update your vitest.config.ts:
 *    ```typescript
 *    import { defineConfig } from 'vitest/config';
 *
 *    export default defineConfig({
 *        test: {
 *            globalSetup: './test/global-setup.ts',
 *        },
 *    });
 *    ```
 * 3. Add your custom setup logic (servers, config, etc.)
 * 4. Use `provide()` to share values with tests
 * 5. Create type declarations for type-safe `inject()`
 *
 * @see Full Vitest docs: https://vitest.dev/config/
 */
export default async function setup(/* { provide }: TestProject */) {
    // Ensure Playwright browsers are available for Vitest browser mode
    // This verifies browser binaries are installed
    const chromiumBrowser = await chromium.launch({ headless: true });
    await chromiumBrowser.close();

    const webkitBrowser = await webkit.launch({ headless: true });
    await webkitBrowser.close();

    // TODO: Add your custom setup logic here
    // Examples:
    // - Start test servers: const server = await startServer();
    // - Provide values to tests: provide('serverPort', port);
    // - Setup environment: process.env.TEST_MODE = 'integration';

    // Return cleanup function
    return async () => {
        // TODO: Add cleanup logic here
        // Examples:
        // - Stop servers: await server.close();
        // - Cleanup resources: await cleanup();
    };
}
