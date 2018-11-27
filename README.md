[![](https://data.jsdelivr.com/v1/package/npm/awezapopup/badge)](https://www.jsdelivr.com/package/npm/awezapopup)
[![CircleCI](https://circleci.com/gh/fastacademy/aweza-popup.svg?style=svg)](https://circleci.com/gh/fastacademy/aweza-popup)
# Aweza Popup
The Aweza popup for web.  

## Install
### CDN
When loading the script from a CDN, the AwezaPopup object will be available as a property of window.
```html
<!-- Script -->
<script src="https://cdn.jsdelivr.net/npm/awezapopup@3.2.1/dist/aweza-popup.min.js"></script>
<script type="text/javascript">
  window.addEventListener('load', function() {
      window.AwezaPopup({
        headers: {
          "AWEZA-KEY": 'YOUR-KEY-HERE',
          "AWEZA-SECRET": 'YOUR-SECRET-HERE'
        }
      })
  })
</script>
<!-- Stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/awezapopup@3.1.7/dist/aweza-popup.min.css">

<!-- To support KaTeX symbols in the popup content, you must include the KaTeX stylesheet seperately. -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css"/>
```
### yarn / npm
Install with the package manger of your choice
```bash
yarn add awezapopup
```
```bash
npm install --save awezapopup
```
#### Import CSS / Sass
```sass
@import "~awezapopup/dist/aweza-popup.min.css";
```
To support KaTeX symbols in the popup content, you must include the KaTeX stylesheet seperately.
```sass
@import "~katex/dist/katex.css";
```
##### Import JS
```js
import AwezaPopup from 'awezapopup';

AwezaPopup({
  headers: {
    "AWEZA-KEY": 'YOUR-KEY-HERE',
    "AWEZA-SECRET": 'YOUR-SECRET-HERE'
  }
})
```


## Usage
```js
AwezaPopup(options)
```
Options
- dataUrl: The URL of the Aweza API (optional)
- headers: An object containing custom request headers. Required for Authentication.
- preferLang: The two digit ISO 639-1 language code of the prefered language to translate to.


## Awezification
Wrap the target in a span with a **data-aweza** attribute where the value is the ID of the term
```html
<span data-aweza="3">Road</span>
```

## Development
To run the file watchers and a php dev server, use the script provided
```bash
./dev.sh
```
## License
GPL-v3