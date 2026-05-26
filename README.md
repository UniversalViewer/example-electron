# Universal Viewer Electron CJS Example

This example shows how to load the Universal Viewer CommonJS build (`dist/cjs/index.js`) into an Electron renderer process.

## Setup

From `npm-examples/electron-cjs-example`:

```bash
npm install
```

## Run

```bash
npm start
```

To open a specific Universal Viewer manifest, pass it as a CLI argument:

```bash
npm start -- --manifest=https://example.org/iiif/manifest
```

or as the first positional argument:

```bash
npm start -- https://example.org/iiif/manifest
```

The TypeScript source files are in `src/`, and compiled output is written to `dist/` before Electron starts.

## Package

```bash
npm run build
```

This packages the example as a Windows desktop app into `release/` using `electron-packager`.

The Electron window loads the Universal Viewer using `require('universalviewer/dist/cjs/index.js')` inside the renderer.

`src/renderer.ts` also installs a runtime hook for `.css` and `.less` imports so the Universal Viewer CJS package can load its styles correctly in Electron.
