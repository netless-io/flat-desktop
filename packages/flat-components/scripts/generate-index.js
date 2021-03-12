/**!
 * generate index.ts which includes all the components
 */
const path = require("path");
const fs = require("fs");

const srcDir = path.resolve(__dirname, "..", "src");

const comps = fs.readdirSync(path.join(srcDir, "components"));

const str =
    "// THIS IS AN AUTO-GENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n\n" +
    comps.map(name => `export { ${name} } from "./components/${name}";`).join("\n") +
    "\n";

fs.writeFileSync(path.join(srcDir, "index.ts"), str);
