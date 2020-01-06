module.exports = {
  before: config => {
    const properties = require('./properties');
    const fs = require('fs');
    const path = require('path');
    const pluginConfig = config.jsdom || {};
    const jsdomConfig = pluginConfig.config || {};
    jsdomConfig.url = jsdomConfig.url || 'http://localhost/';

    let fileData = (pluginConfig.file || jsdomConfig.file) && fs.readFileSync(pluginConfig.file || jsdomConfig.file).toString();
    if (!fileData && config.filePath) {
      const htmlFileWithTheSameName = config.filePath.replace(/\.[^.]+$/, '.html');
      if (fs.existsSync(htmlFileWithTheSameName)) {
        fileData = fs.readFileSync(htmlFileWithTheSameName).toString();
      } else {
        const indexHtmlFileInTheSameFolder = path.join(path.dirname(config.filePath), 'index.html');
        if (fs.existsSync(indexHtmlFileInTheSameFolder)) {
          fileData = fs.readFileSync(indexHtmlFileInTheSameFolder).toString();
        }
      }
    }
    const html = fileData || pluginConfig.html || '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div></body></html>';
    const jsdom = require('jsdom');
    const document = new jsdom.JSDOM(html, jsdomConfig).window.document;

    properties.forEach((property) => {
      if (property !== 'root' && typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
      }
    });

    global.navigator = {
      userAgent: pluginConfig.userAgent || 'quokka.js'
    };

    if (!global.localStorage) {
      global.localStorage = mockLocalStorage;
    }
    if (!global.sessionStorage) {
      global.sessionStorage = mockSessionStorage;
    }

    if (!console.debug) {
      console.debug = console.log;
    }
  }
};

const localStorageContent = {};
const mockLocalStorage = {
  setItem: function (key, value) {
    localStorageContent[key] = value;
  },
  getItem: function (key) {
    return key in localStorageContent ? localStorageContent[key] : null;
  },
  removeItem: function (key) {
    return delete localStorageContent[key]
  }
};

let sessionStorageContent = {};
const mockSessionStorage = {
  setItem: function (key, value) {
    sessionStorageContent[key] = value + '';
  },
  getItem: function (key) {
    return key in sessionStorageContent ? sessionStorageContent[key] : null;
  },
  removeItem: function (key) {
    return delete sessionStorageContent[key]
  },
  clear: function () {
    sessionStorageContent = {};
  }
};
