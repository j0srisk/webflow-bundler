#!/usr/bin/env node

import { main } from "./index.js";
import path from "path";
import fs from "fs";

// Parse command line arguments
const args = process.argv.slice(2);
let sourceDir = "src";
let outputDir = "dist/js";

// Simple argument parsing
let minify = false;
let html = false;
let stripConsole = false;
let dropConsole = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--source" || args[i] === "-s") {
    sourceDir = args[i + 1];
    i++;
  } else if (args[i] === "--output" || args[i] === "-o") {
    outputDir = args[i + 1];
    i++;
  } else if (args[i] === "--minify") {
    minify = true;
  } else if (args[i] === "--html") {
    html = true;
  } else if (args[i] === "--drop-console") {
    dropConsole = true;
  }
}

// Resolve paths relative to current working directory
sourceDir = path.resolve(process.cwd(), sourceDir);
outputDir = path.resolve(process.cwd(), outputDir);

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory "${sourceDir}" does not exist.`);
  process.exit(1);
}

// Run the build
main(sourceDir, outputDir, minify, html, dropConsole)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
