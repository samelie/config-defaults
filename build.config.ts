import type { IPackageJson } from "package-json-type";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pkgJson = JSON.parse(readFileSync(join(__dirname, "package.json") || "", "utf-8")) as IPackageJson;

export default makeUnbuildConfig({
    entries: [
        "src/knip.config",
        "src/vite.config",
    ],
    declaration: true,
    externals: [
        ...Object.keys(pkgJson.dependencies || {}),
        ...Object.keys(pkgJson.devDependencies || {}),
    ],
});
