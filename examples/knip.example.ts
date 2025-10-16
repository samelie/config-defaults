/**
 * Example usage of defineKnipConfig
 *
 * This file demonstrates how to use the defineKnipConfig function
 * to create a customized Knip configuration that extends the defaults.
 */

import { defineKnipConfig } from "../src/knip.config";

// Example 1: Basic usage with additional entry points
export const basicConfig = defineKnipConfig({
    entry: ["src/main.ts", "src/cli.ts"],
});

// Example 2: Adding custom ignore patterns
export const withCustomIgnores = defineKnipConfig({
    ignore: [
        "**/__tests__/**",
        "**/__mocks__/**",
        "**/fixtures/**",
        "**/*.generated.ts",
    ],
});

// Example 3: Customizing rules
export const withCustomRules = defineKnipConfig({
    rules: {
        classMembers: "error", // Enable checking unused class members
        enumMembers: "off", // Disable checking enum members
    },
});

// Example 4: Monorepo workspace configuration
export const monorepoConfig = defineKnipConfig({
    entry: ["apps/*/src/main.ts", "packages/*/src/index.ts"],
    workspaces: {
        "packages/ui": {
            entry: ["src/index.ts"],
            ignoreDependencies: ["@storybook/react"],
            ignore: ["**/*.stories.tsx"],
        },
        "packages/api": {
            entry: ["src/server.ts"],
            project: ["src/**/*.ts"],
            ignoreDependencies: ["@types/node"],
        },
    },
});

// Example 5: Full custom configuration
export const fullCustomConfig = defineKnipConfig({
    entry: ["src/main.ts"],
    project: ["src/**/*.ts"],
    ignore: ["**/*.spec.ts"],
    ignoreDependencies: ["@types/*"],
    ignoreBinaries: ["docker", "kubectl"],
    paths: {
        "@lib": ["./lib/index.ts"],
        "@lib/*": ["./lib/*"],
        "@utils/*": ["./utils/*"],
    },
    rules: {
        files: "error",
        exports: "warn",
        classMembers: "error",
    },
    includeEntryExports: true,
});

// Example 6: Overriding default values
export const overrideDefaults = defineKnipConfig({
    // This will override the default `false` value
    treatConfigHintsAsErrors: true,
    // This will override the default `false` value
    eslint: true,
});
