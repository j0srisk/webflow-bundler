# webflow-bundler

A Node.js tool for bundling, minifying, and cleaning JavaScript/TypeScript code so it can be easily copy-pasted into [Webflow](https://webflow.com/) custom code blocks and pages. Use it directly in your `package.json` scripts for a seamless workflow. This tool streamlines preparing modern JS/TS for Webflow, ensuring compatibility, reduced file size, and easy embedding.

## Features

- **Bundle**: Combines all imports and dependencies into a single file per entrypoint.
- **Minify**: Produces a minified version for optimal performance.
- **HTML Wrapping**: Optionally wraps output in `<script>...</script>` tags for direct embedding in Webflow custom code blocks.
- **Console Stripping**: Optionally removes all `console.*` statements for cleaner production code.
- **TypeScript & JavaScript**: Supports both `.ts` and `.js` source files.
- **Pretty Output**: Outputs a prettified, readable version alongside the minified one.

## Installation

Install as a dev dependency:

```bash
npm install --save-dev webflow-bundler
```

## Usage

The most common way to use `webflow-bundler` is in your `package.json` scripts.

### In package.json

Add a script:

```json
{
  "scripts": {
    "bundle:webflow": "webflow-bundler --source src --output dist/js --minify --html --drop-console"
  }
}
```

Then run:

```bash
npm run bundle:webflow
```

#### Options

| Option           | Alias | Description                                                     |
| ---------------- | ----- | --------------------------------------------------------------- |
| `--source <dir>` | `-s`  | Source directory (default: `src`)                               |
| `--output <dir>` | `-o`  | Output directory (default: `dist/js`)                           |
| `--minify`       |       | Also output a minified `.min.js` or `.min.html` version         |
| `--html`         |       | Wrap output in `<script>...</script>` tags (for Webflow blocks) |
| `--drop-console` |       | Remove all `console.*` statements from output                   |

#### Example

Bundle and minify all files in `src` for Webflow, outputting both pretty and minified HTML-wrapped scripts:

```bash
npm run bundle:webflow
# or, if installed globally
webflow-bundler --source src --output dist/js --minify --html --drop-console
```

## How It Works

- Bundles each `.js`/`.ts` file with its dependencies using [esbuild](https://esbuild.github.io/).
- Outputs both a prettified (formatted) and optionally minified version.
- If `--html` is set, wraps output in `<script>...</script>` for easy embedding.
- If `--drop-console` is set, strips all `console.*` calls.

## Output

- Each source file generates a bundled output in the specified output directory, preserving relative paths.
- If `--minify` is used, a `.min.js` (or `.min.html`) file is also created.
- If `--html` is used, output files are HTML-wrapped for direct copy-paste into Webflow.

## Troubleshooting

- **Source directory does not exist**: Make sure your `--source` directory exists and contains `.js` or `.ts` files.
- **Import errors**: Currently only JS/TS imports are supported. Other asset types like CSS, images, etc. will cause a build error.

## License

MIT

---
