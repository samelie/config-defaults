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
