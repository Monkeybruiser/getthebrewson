'use strict';
importScripts('sw-toolbox.js'); toolbox.precache(["index.php","library/css/style.css"]); toolbox.router.get('library/images/*', toolbox.cacheFirst); toolbox.router.get('/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});
