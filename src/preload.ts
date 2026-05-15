import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('universalviewer', {
  init: (containerId: string, options: Record<string, unknown>) => {
    const globalAny = globalThis as any;

    if (typeof globalAny.window === 'undefined') {
      globalAny.window = globalAny;
    }

    if (typeof globalAny.self === 'undefined') {
      globalAny.self = globalAny;
    }

    if (typeof globalAny.document === 'undefined' && typeof (globalAny.window || {}).document !== 'undefined') {
      globalAny.document = globalAny.window.document;
    }

    const uvModule = require('universalviewer/dist/cjs/index.js');
    return uvModule.init(containerId, options);
  }
});
