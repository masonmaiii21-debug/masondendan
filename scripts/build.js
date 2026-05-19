const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const JS_FILES = [
  ["order-data.js", "order-data.min.js"],
  ["app.js", "app.min.js"],
  ["shipping-data.js", "shipping-data.min.js"],
  ["shipping.js", "shipping.min.js"],
  ["shipping-documents.js", "shipping-documents.min.js"],
  ["air-data.js", "air-data.min.js"],
  ["air.js", "air.min.js"],
  ["air-docs-data.js", "air-docs-data.min.js"],
  ["air-docs.js", "air-docs.min.js"],
  ["docs-data.js", "docs-data.min.js"],
  ["docs.js", "docs.min.js"],
  ["customs-data.js", "customs-data.min.js"],
  ["customs.js", "customs.min.js"],
];

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function write(file, content) {
  fs.writeFileSync(path.join(ROOT, file), content);
}

function minifyCss(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function buildCss() {
  if (!fs.existsSync(path.join(ROOT, "styles.css"))) {
    console.log("跳过 styles.css（未解锁）");
    return;
  }
  write("styles.min.css", minifyCss(read("styles.css")));
  console.log("已生成 styles.min.css");
}

function buildJs() {
  JS_FILES.forEach(([src, dest]) => {
    if (!fs.existsSync(path.join(ROOT, src))) {
      console.log(`跳过 ${src}（未解锁）`);
      return;
    }
    const npx = process.platform === "win32" ? "npx.cmd" : "npx";
    const result = spawnSync(npx, [
      "--yes",
      "javascript-obfuscator",
      path.join(ROOT, src),
      "--output",
      path.join(ROOT, dest),
      "--compact",
      "true",
      "--control-flow-flattening",
      "false",
      "--string-array",
      "true",
      "--string-array-threshold",
      "0.45"
    ], { stdio: "pipe", cwd: ROOT, encoding: "utf8", shell: process.platform === "win32" });

    if (result.status === 0) {
      console.log(`已混淆生成 ${dest}`);
      return;
    }

    const reason = result.error?.message || result.stderr?.trim() || "未知错误";
    write(dest, read(src));
    console.log(`已生成 ${dest}（混淆失败，已降级为可运行版本：${reason}）`);
  });
}

buildCss();
buildJs();
