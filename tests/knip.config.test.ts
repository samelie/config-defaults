import { describe, expect, it } from "vitest";
import { defineKnipConfig } from "../src/knip.config";

describe("defineKnipConfig", () => {
    it("should return default config when no overrides provided", () => {
        const config = defineKnipConfig();
        expect(config.$schema).toBe("https://unpkg.com/knip@5/schema.json");
        expect(config.treatConfigHintsAsErrors).toBe(false);
        expect(config.eslint).toBe(false);
    });

    it("should deeply merge overrides with default config", () => {
        const config = defineKnipConfig({
            entry: ["src/main.ts"],
            ignore: ["**/*.custom.ts"],
            rules: {
                classMembers: "error",
            },
        });

        // New values should be added
        expect(config.entry).toContain("src/main.ts");
        expect(config.ignore).toContain("**/*.custom.ts");

        // Default ignore patterns should still be present
        expect(config.ignore).toContain("**.eslintrc*");
        expect(config.ignore).toContain("**/eslint.config.mjs");

        // Merged rules - new rule added
        expect(config.rules?.classMembers).toBe("error");
        // Default rules preserved
        expect(config.rules?.dependencies).toBe("error");
        expect(config.rules?.files).toBe("error");
    });

    it("should override default values when explicitly set", () => {
        const config = defineKnipConfig({
            treatConfigHintsAsErrors: true,
            eslint: true,
        });

        expect(config.treatConfigHintsAsErrors).toBe(true);
        expect(config.eslint).toBe(true);
    });

    it("should deeply merge nested objects", () => {
        const config = defineKnipConfig({
            paths: {
                "@lib": ["./lib/index.ts"],
                "@utils/*": ["./utils/*"],
            },
            workspaces: {
                "packages/example": {
                    entry: ["src/index.ts"],
                    ignoreDependencies: ["some-dep"],
                },
            },
        });

        expect(config.paths?.["@lib"]).toEqual(["./lib/index.ts"]);
        expect(config.paths?.["@utils/*"]).toEqual(["./utils/*"]);
        expect(config.workspaces?.["packages/example"]).toBeDefined();
        expect(config.workspaces?.["packages/example"]?.entry).toEqual(["src/index.ts"]);
    });

    it("should handle array merging correctly", () => {
        const config = defineKnipConfig({
            ignoreDependencies: ["custom-dep"],
        });

        // Arrays are concatenated by lodash merge
        expect(config.ignoreDependencies).toContain("custom-dep");
        // Default ignoreDependencies should still be present
        expect(config.ignoreDependencies).toContain("@adddog/eslint");
        expect(config.ignoreDependencies).toContain("@adddog/build-configs");
    });
});
