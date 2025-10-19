# @adddog/config-defaults

Type-safe configuration defaults for various tools in the monorepo.

## Installation

```bash
pnpm add @adddog/config-defaults
```

## Knip Configuration

The package provides a type-safe wrapper for Knip configuration with sensible defaults and deep merging support.

### Basic Usage

#### Using Default Configuration

```ts
// knip.config.ts
import defaultConfig from "@adddog/config-defaults/src/knip.config";

export default defaultConfig;
```

#### Using with Overrides

```ts
// knip.config.ts
import { defineKnipConfig } from "@adddog/config-defaults/src/knip.config";

export default defineKnipConfig({
  entry: ["src/main.ts", "src/cli.ts"],
  ignore: ["**/*.test.ts", "**/__mocks__/**"],
  rules: {
    classMembers: "error",
  },
});
```

### Features

- **Type Safety**: Full TypeScript support with `KnipConfig` type
- **Deep Merge**: Uses `lodash-es` for deep merging of configuration objects
- **Array Concatenation**: Arrays are concatenated instead of replaced, preserving default patterns
- **Sensible Defaults**: Pre-configured with best practices for monorepo setups

### Configuration Examples

#### Adding Entry Points

```ts
export default defineKnipConfig({
  entry: [
    "src/main.ts",
    "src/cli.ts",
    "apps/*/src/main.ts", // Monorepo pattern
  ],
});
```

#### Extending Ignore Patterns

```ts
export default defineKnipConfig({
  ignore: [
    // Defaults are preserved, these are added:
    "**/__tests__/**",
    "**/__mocks__/**",
    "**/fixtures/**",
  ],
});
```

#### Customizing Rules

```ts
export default defineKnipConfig({
  rules: {
    // Enable class member checking
    classMembers: "error",
    // Disable certain checks
    enumMembers: "off",
  },
});
```

#### Workspace-Specific Configuration

```ts
export default defineKnipConfig({
  workspaces: {
    "packages/ui": {
      entry: ["src/index.ts"],
      ignoreDependencies: ["@storybook/react"],
    },
    "packages/api": {
      entry: ["src/server.ts"],
      project: ["src/**/*.ts"],
    },
  },
});
```

### Default Configuration

The default configuration includes:

- ESLint plugin disabled (avoids common configuration errors)
- Common ignore patterns (Storybook, test files, etc.)
- Ignored binaries (knip itself)
- Ignored dependencies (tsx, eslint, typescript, vitest)
- Strict rules for detecting unused code
- Vitest configuration support
- TypeScript configuration support

See [src/knip.config.ts](./src/knip.config.ts) for the full default configuration.

## Vite Configuration

The package provides a comprehensive Vite configuration with production-ready defaults for modern web applications.

### Basic Usage

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config';
import baseConfig from '@adddog/config-defaults/vite.config';

export default defineConfig({
  ...baseConfig,
  // Your overrides
  plugins: [
    ...baseConfig.plugins || [],
    // Add your plugins
  ],
});
```

### Features

- **Modern Build Targets**: Baseline widely-available browser support
- **Optimized Dependencies**: Pre-configured optimization and exclusions
- **CSS Support**: SCSS preprocessor with source maps
- **Production Build**: Minification, code splitting, and vendor chunking
- **Dev Server**: HMR with overlay, configurable ports
- **Worker Support**: Web Worker configuration

See [src/vite.config.ts](./src/vite.config.ts) for the full configuration options and inline documentation.

## Vitest Configuration

The package provides a comprehensive Vitest configuration for browser-based testing using Playwright.

### Basic Usage

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@adddog/config-defaults/vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Your overrides
      include: ['test/**/*.test.ts'],
    },
  })
);
```

### Features

- **Browser Testing**: Pre-configured Playwright with Chromium and WebKit
- **Global Setup**: Browser verification and test environment setup
- **Coverage**: V8 coverage with configurable thresholds (80%)
- **Parallel Execution**: File parallelism and browser isolation
- **Mock Management**: Auto-clear and restore mocks between tests

### Browser Testing Setup

The configuration includes two setup files:

#### 1. Global Setup (Node.js Context)

Located at `src/browser/global-setup.ts` - runs **once** before all tests in Node.js.

**Current Features:**
- Verifies Playwright browsers are installed
- Validates browser binaries work correctly

**Customization Options:**

```ts
// Copy and customize in your project: test/global-setup.ts
import type { TestProject } from 'vitest/node';

export default async function setup({ provide }: TestProject) {
  // 1. Provide context to tests
  provide('browserInfo', {
    chromiumVersion: '120.0.0',
    timestamp: Date.now(),
  });

  // 2. Start test servers
  const server = await startTestServer();
  provide('testServerPort', server.address().port);

  // 3. Environment-specific config
  provide('testConfig', {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.NODE_ENV === 'development' ? 100 : 0,
  });

  return async () => {
    // Cleanup
    await server.close();
  };
}
```

**Using Provided Values in Tests:**

```ts
import { inject } from 'vitest';

const browserInfo = inject('browserInfo');
const port = inject('testServerPort');
```

**Type-Safe Context (Recommended):**

```ts
// In your project types file
declare module 'vitest' {
  export interface ProvidedContext {
    browserInfo: { chromiumVersion: string; timestamp: number };
    testServerPort: number;
    testConfig: { headless: boolean; slowMo: number };
  }
}
```

#### 2. Browser Setup (Browser Context)

Located at `src/browser/setup.browser.ts` - runs in the browser before each test file.

**Current Features:**
- Clears DOM between tests
- Tracks and terminates workers
- Provides test logging utilities

**Customization:**

```ts
// Copy to your project: test/setup.browser.ts
import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  document.body.innerHTML = '';
  // Your custom setup
});

afterEach(() => {
  // Cleanup
});
```

### Integration with Your Project

1. **Copy and Customize Setup Files:**
   ```bash
   # Copy global setup
   cp node_modules/@adddog/config-defaults/src/browser/global-setup.ts test/

   # Copy browser setup
   cp node_modules/@adddog/config-defaults/src/browser/setup.browser.ts test/
   ```

2. **Update Your Config:**
   ```ts
   // vitest.config.ts
   import { defineConfig, mergeConfig } from 'vitest/config';
   import baseConfig from '@adddog/config-defaults/vitest.config';

   export default mergeConfig(
     baseConfig,
     defineConfig({
       test: {
         globalSetup: './test/global-setup.ts',
         setupFiles: ['./test/setup.browser.ts'],
       },
     })
   );
   ```

3. **Add Custom Logic:**
   - Start servers in `global-setup.ts`
   - Provide ports/URLs to tests using `provide()`
   - Add browser-specific setup in `setup.browser.ts`
   - Create type declarations for provided context

### Documentation Links

- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [Vitest Global Setup](https://vitest.dev/config/#globalsetup)
- [Vitest Configuration](https://vitest.dev/config/)
- [Playwright Integration](https://playwright.dev/docs/intro)

See [src/vitest.config.ts](./src/vitest.config.ts) for the full configuration with detailed inline comments.

## API

### `defineKnipConfig(overrides?: Partial<KnipConfig>): KnipConfig`

Creates a Knip configuration by deep merging the default configuration with user-supplied overrides.

**Parameters:**
- `overrides` (optional): Partial Knip configuration to merge with defaults

**Returns:**
- Complete Knip configuration with overrides applied

**Behavior:**
- Objects are deeply merged
- Arrays are concatenated (not replaced)
- Primitive values in overrides replace defaults

### `defaultKnipConfig`

The raw default configuration object, exported as the default export.

## Development

### Scripts

| Script | Description |
|--------|-------------|
| `test` | `vitest run` |
| `types` | `tsc -p tsconfig.typecheck.json` |
| `lint` | `eslint .` |
| `lint:fix` | `eslint --fix .` |

## License

MIT
