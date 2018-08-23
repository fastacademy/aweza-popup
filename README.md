# Aweza Popup
A popup for the Aweza platform based on tippy.js 
### Yarn
```bash
yarn add aweza-popup
```

```js
import AwezaPopup from 'aweza-popup'
AwezaPopup({
  dataUrl: 'http://awezatms.test/api/term',
  headers: {
    "AWEZA-KEY": 'a9e4db54cecd597b8afd3325d185d302',
    "AWEZA-SECRET": '07ecf23fa58ca8a1464d6c212e2d8c505ea960ca6dd9104ea1062fcacd63b375'
  }
})
```
### Manual
```html
<script src="aweza-popup.js"></script>
<script>
  window.onload = function() {
    window.AwezaPopup({
      dataUrl: 'http://awezatms.test/api/term',
      headers: {
        "AWEZA-KEY": 'a9e4db54cecd597b8afd3325d185d302',
        "AWEZA-SECRET": '07ecf23fa58ca8a1464d6c212e2d8c505ea960ca6dd9104ea1062fcacd63b375'
      }
    })
  }
</script>
```

### Awezification
Wrap the target in a span with a **data-aweza** attribute where the value is the ID of the term
```html
<span data-aweza="3">Road</span>
```