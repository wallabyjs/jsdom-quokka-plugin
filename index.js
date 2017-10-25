module.exports = {
  before: config => {
    const fs = require('fs');
    const pluginConfig = config.jsdom || {};
    const jsdomConfig = pluginConfig.config || {};
    const fileData = jsdomConfig.file && fs.readFileSync(jsdomConfig.file).toString();
    const html = fileData || pluginConfig.html || '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div></body></html>';
    const jsdom = require('jsdom/lib/old-api.js');
    const document = jsdom.jsdom(html, jsdomConfig);

    Object.keys(document.defaultView).forEach((property) => {
      if (property !== 'root' && typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
      }
    });

    global.navigator = {
      userAgent: pluginConfig.userAgent || 'quokka.js'
    };

    if (!console.debug) {
      console.debug = console.log;
    }
  }
};