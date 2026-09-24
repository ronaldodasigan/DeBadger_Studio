# DeBadger Studio Assets

Place permanent image files for the app in this folder.

Use lowercase filenames without spaces, for example:

- `logo.png`
- `hero-image.jpg`
- `custom-pin-badge.png`

Reference an image from HTML with:

```html
<img src="assets/logo.png" alt="DeBadger Studio">
```

Reference an image from CSS with:

```css
background-image: url("assets/hero-image.jpg");
```

Reference an image from `app.js` with the same relative path:

```js
const image = '<img src="assets/custom-pin-badge.png" alt="Custom pin badge">';
```
