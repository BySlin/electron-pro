{
  "name": "{{{ name }}}",
  "version": "0.0.1",
  "description": "{{{ description }}}",
  "scripts": {
    "dev": "cross-env NODE_ENV=development MIDWAY_SERVER_ENV=local electron-pro-cli dev",
    "electron:dir": "cross-env NODE_ENV=production electron-pro-cli build --dir",
    "electron:build:win": "cross-env NODE_ENV=production electron-pro-cli build --win",
    "electron:build:mac": "cross-env NODE_ENV=production electron-pro-cli build --mac",
    "electron:build:linux": "cross-env NODE_ENV=production electron-pro-cli build --linux"
  },
  "keywords": [],
  "authors": [{{#author}}
    "{{{ author }}}"
  {{/author}}],
  "license": "MIT",
  "files": [
    "dist",
    "compiled"
  ],
  "publishConfig": {
    "access": "public"
  },
  "dependencies": {
    "electron-pro": "{{{ version }}}"
  },
  "devDependencies": {
    "electron": "^22.1.0",
    "electron-pro-cli": "{{{ version }}}",
    "cross-env": "^7.0.3"
  }
}
