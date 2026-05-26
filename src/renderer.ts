import path from 'path';

const nodeRequire = require as any;
const fs = nodeRequire('fs');
const loadedStyles = new Set<string>();

function injectCss(css: string): void {
  const head = document.head || document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}

function loadCssFile(filename: string): void {
  if (loadedStyles.has(filename)) {
    return;
  }

  loadedStyles.add(filename);
  const css = fs.readFileSync(filename, 'utf8');
  injectCss(css);
}

function loadLessFile(filename: string): void {
  if (loadedStyles.has(filename)) {
    return;
  }

  loadedStyles.add(filename);
  const less = nodeRequire('less');
  const source = fs.readFileSync(filename, 'utf8');

  less
    .render(source, { filename })
    .then((output: { css: string }) => {
      injectCss(output.css);
    })
    .catch((error: Error) => {
      console.error('Failed to compile LESS:', filename, error);
    });
}

if (nodeRequire.extensions) {
  nodeRequire.extensions['.css'] = (module: NodeModule, filename: string) => {
    loadCssFile(filename);
    module.exports = {};
  };

  nodeRequire.extensions['.less'] = (module: NodeModule, filename: string) => {
    loadLessFile(filename);
    module.exports = {};
  };
}

// Force Universal Viewer and the OpenSeadragon viewer hook to share the same
// openseadragon instance. This avoids runtime patching mismatches inside the
// nested universalviewer package when Electron loads the CJS bundle.
try {
  const nestedOSDPath = path.join(__dirname, '../node_modules/universalviewer/node_modules/openseadragon');
  const topLevelOSDPath = nodeRequire.resolve('openseadragon');
  const nestedResolvedPath = nodeRequire.resolve(nestedOSDPath);

  if (nodeRequire.cache[nestedResolvedPath]) {
    nodeRequire.cache[topLevelOSDPath] = nodeRequire.cache[nestedResolvedPath];
  }
} catch (error) {
  console.warn('OpenSeadragon alias failed:', error);
}

const params = new URLSearchParams(window.location.search);
const manifestUrl = params.get('manifest') ?? 'https://wellcomelibrary.org/iiif/b18035723/manifest';

window.addEventListener('DOMContentLoaded', () => {
  const uvModule = nodeRequire('universalviewer/dist/cjs/index.js');

  if (uvModule && typeof uvModule.init === 'function') {
    uvModule.init('root', {
      manifest: manifestUrl
    });
  } else {
    console.error('Failed to load Universal Viewer module');
  }
});
