import type { IPackageJson } from "package-json-type";
import { readFileSync } from "node:fs";
import { parse } from "node:path";
import { fileURLToPath } from "node:url";
import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";
import { packageUpSync } from "package-up";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const p = packageUpSync({
    cwd: parse(__dirname).dir,
});
const pkgJson = JSON.parse(readFileSync(p || "", "utf-8")) as IPackageJson;

export default makeUnbuildConfig({
    entries: [
        "src/knip.config",
        "src/vite.config",
    ],
    declaration: true,
    externals: [...Object.keys(pkgJson.devDependencies || [])],
});
