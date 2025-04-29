# webflow-bundler

A CLI tool for bundling, minifying, and cleaning JavaScript/TypeScript code so it can be easily copy-pasted into [Webflow](https://webflow.com/) custom code blocks and pages. This tool is designed to streamline the process of preparing modern JS/TS code for use in Webflow, ensuring compatibility, reduced file size, and easy embedding.

## Features

- **Bundle**: Combines all imports and dependencies into a single file per entrypoint.
- **Minify**: Produces a minified version for optimal performance.
- **HTML Wrapping**: Optionally wraps output in `<script>...</script>` tags for direct embedding in Webflow custom code blocks.
- **Console Stripping**: Optionally removes all `console.*` statements for cleaner production code.
- **TypeScript & JavaScript**: Supports both `.ts` and `.js` source files.
- **Pretty Output**: Outputs a prettified, readable version alongside the minified one.

## Installation

Clone the repo and install dependencies:

```bash
npm install
```

## Usage

By default, the tool bundles all `.js` and `.ts` files in the `src` directory and outputs to `dist/js`.

### CLI

```bash
webflow-bundler [options]
```

### package.json

```json
{
  "scripts": {
    "webflow-bundler": "webflow-bundler [options]"
  }
}
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
webflow-bundler --source src --output dist/js --minify --html --drop-console
```

## How It Works

- Bundles each `.js`/`.ts` file with its dependencies using [esbuild](https://esbuild.github.io/).
- Outputs both a prettified (formatted) and optionally minified version.
- If `--html` is set, wraps output in `<script>...</script>` for easy embedding.
- If `--drop-console` is set, strips all `console.*` calls.
- Fails fast if any non-JS/TS asset is imported.

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
