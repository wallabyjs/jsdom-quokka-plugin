module.exports = {
  before: config => {
    const pluginConfig = config.jsdom || {};
    const jsdomConfig = pluginConfig.config || {};
    const html = pluginConfig.html || '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div></body></html>';
    const jsdom = require('jsdom/lib/old-api.js');
    const document = jsdom.jsdom(html, jsdomConfig);

    Object.keys(document.defaultView).forEach((property) => {
      if (typeof global[property] === 'undefined') {
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