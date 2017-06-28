[Quokka.js plugin](https://quokkajs.com/) to enable browser-like environment via [`jsdom`](https://github.com/tmpvar/jsdom).

## Install

```
npm install jsdom-quokka-plugin
```

## Configuration

Available [configuration settings](https://quokkajs.com/docs/configuration.html):

```
{
    "plugins": ["jsdom-quokka-plugin"],
    "jsdom": {
        "html": "...",
        "userAgent": "...",
        "config": {...}
    }
}
```

The `config` setting is [the `jsdom` config setting](https://github.com/tmpvar/jsdom/blob/master/lib/old-api.md#how-it-works).
