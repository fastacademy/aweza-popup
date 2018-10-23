[![](https://data.jsdelivr.com/v1/package/npm/awezapopup/badge)](https://www.jsdelivr.com/package/npm/awezapopup)
[![CircleCI](https://circleci.com/gh/fastacademy/aweza-popup.svg?style=svg)](https://circleci.com/gh/fastacademy/aweza-popup)
# Aweza Popup
A popup for the Aweza platform based on tippy.js 

## Install
### Yarn
```bash
yarn add awezapopup
```
### NPM
```bash
npm install --save awezapopup
```
```js
import AwezaPopup from 'awezapopup'
AwezaPopup({
  headers: {
    "AWEZA-KEY": 'a9e4........d302',
    "AWEZA-SECRET": '07ecf........b375'
  }
})
```
## CDN
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/awezapopup@3.0.0/dist/aweza-popup.min.css">
<script src="https://cdn.jsdelivr.net/npm/awezapopup@3.0.0/dist/aweza-popup.min.js"></script>
<script>
  window.onload = function() {
    window.AwezaPopup({
      headers: {
        "AWEZA-KEY": 'a9e4........d302',
        "AWEZA-SECRET": '07ecf........b375'
      }
    })
  }
</script>
```

## Usage
```js
AwezaPopup(options)
```
Options
- dataUrl: The URL of the Aweza API (optional)
- headers: An object containing custom request headers. Required for Authentication.
- preferLang: The two digit ISO 639-1 language code of the prefered language to translate to.

## Example
```js
AwezaPopup({
  headers: {
    "AWEZA-KEY": 'a9e4........d302',
    "AWEZA-SECRET": '07ecf........b375',
  },
  preferLang: 'af',
  dataUrl: 'http://localhost:8888/api/term'
})
```

## Awezification
Wrap the target in a span with a **data-aweza** attribute where the value is the ID of the term
```html
<span data-aweza="3">Road</span>
```

## Development
To run the file watchers and a php dev server, use the script provided
```
./dev.sh
```
