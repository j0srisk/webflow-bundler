import path from "path";
import fs from "fs-extra";
import { glob } from "glob";
import prettier from "prettier";
import esbuild from "esbuild";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processFile(
  filePath: string,
  srcDir: string,
  distDir: string,
  minify: boolean,
  html: boolean = false,
  dropConsole: boolean = false
) {
  const relPath = path.relative(srcDir, filePath);
  let outRelPath = relPath
    .replace(/\.ts$/, html ? ".html" : ".js")
    .replace(/\.js$/, html ? ".html" : ".js");
  const outPath = path.join(distDir, outRelPath);
  const minPath = html
    ? outPath.replace(/\.html$/, ".min.html")
    : outPath.replace(/\.js$/, ".min.js");
  await fs.ensureDir(path.dirname(outPath));

  // Use esbuild to bundle the file and its dependencies into a single JS file
  try {
    await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      format: "esm",
      outfile: outPath,
      platform: "browser",
      sourcemap: false,
      minifySyntax: true,
      minify: false,
      treeShaking: true,
      logLevel: "silent",
      pure: dropConsole
        ? [
            "console.log",
            "console.error",
            "console.warn",
            "console.info",
            "console.debug",
          ]
        : [],
    });
  } catch (err) {
    if (err instanceof Error) {
      console.warn(`❌ esbuild failed for ${filePath}:`, err.message);
    } else {
      console.warn(`❌ esbuild failed for ${filePath}:`, err);
    }
    return;
  }

  // Format output: always write pretty version
  let js = await fs.readFile(outPath, "utf8");
  // Remove all esbuild's source file comments (any .ts or .js path) anywhere in the script
  js = js.replace(/^\/\/[^\n]*\.(ts|js)\n/gm, "");
  let pretty = await prettier.format(js, { parser: "babel" });
  if (html) {
    const htmlWrapped = `<script>\n${pretty}<\/script>\n`;
    await fs.writeFile(outPath, htmlWrapped, "utf8");
  } else {
    await fs.writeFile(outPath, pretty, "utf8");
  }
  console.log(`✅ Processed: ${filePath} -> ${outPath}`);

  // If minify, output .min.js as single line
  if (minify) {
    try {
      await esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        format: "esm",
        outfile: minPath,
        platform: "browser",
        sourcemap: false,
        minifySyntax: true,
        minify: true,
        treeShaking: true,
        logLevel: "silent",
        pure: dropConsole
          ? [
              "console.log",
              "console.error",
              "console.warn",
              "console.info",
              "console.debug",
            ]
          : [],
      });
    } catch (err) {
      if (err instanceof Error) {
        console.warn(
          `❌ esbuild (minify) failed for ${filePath}:`,
          err.message
        );
      } else {
        console.warn(`❌ esbuild (minify) failed for ${filePath}:`, err);
      }
      return;
    }
    let minJs = await fs.readFile(minPath, "utf8");
    // Remove esbuild's source file comment at the top, if present (any .ts or .js path)
    minJs = minJs.replace(/^\/\/[^\n]*\.(ts|js)\n/, "");
    // Extra aggressive: force single line
    let minified = minJs
      .replace(/\s+/g, " ")
      .replace(/\s*([{};,:])\s*/g, "$1")
      .trim();
    if (html) {
      const htmlMin = `<script>${minified}<\/script>`;
      await fs.writeFile(minPath, htmlMin, "utf8");
    } else {
      await fs.writeFile(minPath, minified, "utf8");
    }
    console.log(`✅ Processed (min): ${filePath} -> ${minPath}`);
  }
}

export async function main(
  srcDir: string,
  distDir: string,
  minify: boolean = false,
  html: boolean = false,
  dropConsole: boolean = false
) {
  console.log(`🚀 Processing files in ${srcDir}...`);
  await fs.emptyDir(distDir);
  const files = glob
    .sync(`${srcDir}/**/*.{js,ts}`, { nodir: true })
    .filter((f) => !f.endsWith(".d.ts"));
  const results = await Promise.allSettled(
    files.map((f) => processFile(f, srcDir, distDir, minify, html, dropConsole))
  );
  results.forEach((result, idx) => {
    if (result.status === "rejected") {
      console.error(`❌ Failed to process ${files[idx]}:`, result.reason);
    }
  });
  console.log("🏁 All files processed.");

  // Remove non-js/html files from distDir
  const allowedExt = html ? [".html", ".min.html"] : [".js", ".min.js"];
  const distFiles = glob.sync(`${distDir}/**/*`, { nodir: true });
  await Promise.all(
    distFiles.map(async (file) => {
      const ext = path.extname(file);
      if (!allowedExt.includes(ext)) {
        await fs.remove(file);
        console.log(`🧹 Removed non-output file: ${file}`);
      }
    })
  );
}

// CLI fallback: use defaults if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const defaultSrc = path.resolve(__dirname, "../src");
  const defaultDist = path.resolve(__dirname, "../dist/js");
  main(defaultSrc, defaultDist, false, false, false).catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
}
