'use strict';

// Load the memory profiler during development
if (process.env.NODE_ENV !== 'production') {
  (function() {
    const loadError = err => {
      throw new URIError(`The script ${err.target.src} is not accessible.`);
    };

    const importScript = (src, loadFunc) => {
      let debugElem = document.createElement('script');
      debugElem.type = 'text/javascript';
      debugElem.onerror = loadError;
      if (loadFunc) {
        debugElem.onload = loadFunc;
      }
      document.body.appendChild(debugElem);
      debugElem.src = src;
    };

    const loadStats = () => {
      let stats = new window.MemoryStats();

      stats.domElement.style.position = 'fixed';
      stats.domElement.style.right = '0px';
      stats.domElement.style.bottom = '0px';

      document.body.appendChild(stats.domElement);

      requestAnimationFrame(function rAFloop() {
        stats.update();
        requestAnimationFrame(rAFloop);
      });
    };

    importScript('/lib/debug.js', loadStats);
  }());
}
