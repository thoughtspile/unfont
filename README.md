# unfont

Embed font-awesome icons into HTML with inline SVG. Zero runtime JS needed, icons displayed instantly.

Font awesome now has 1600+ icons in the free pack, pushing the bundle to ~200K — it's a lot of code to only use a few icons. It also takes a while to load, and the icons are not rendered while it's loading. Font awesome's [SVG + JS core](https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core) is a JS runtime that dynamically replaces `<i>` with inline SVG. Smart, but extra 40K (13K gzip) of JS is not always welcome, and still leaves your users with missing icons during script load.

As a lightweight alternative, I made this package that renders font awesome icons into inline SVG. It comes with the standard tradeoffs of inline SVG (no caching), but works well for static HTML websites with, and is a perfect fit fort critical content. Works with any JS-based templates.

## Basic usage

Play around with the icon generator in the (sandbox)[https://codesandbox.io/s/unfont-demo-jf0y2?file=/src/index.js], but don't use `unfont` client-side.

Install:

```sh
$ npm i unfont
$ yarn add unfont
```

Import CSS into your styles bundle (it's just copied over from `@fortawesome/fontawesome-svg-core`, no need to duplicate if you already run SVG + JS runtime):

```css
@import 'unfont/css/fs.css';
```

You can also import from JS or `<link>` to it as per your build setup.

Use in your template:

```js
const { fa } = require('unfont');

// instead of <i class="fab fa-twitter"></i>
fa('fab fa-twitter'); // returns inline SVG to directly put into your HTML
```

Add custom classes:

```js
fa('fas fa-camera fa-2x'); // <svg class="... fas fa-camera fa-2x">
fa('fas fa-camera block__icon'); // <svg class="... fas fa-camera block__icon">
```

Add attributes:

```js
fa('fas fa-camera', {
  attributes: { 'id': 'camera-icon' }
});
// <svg id="camera-icon">
```

Add inline styles:

```js
fa('fas fa-camera', {
  styles: { 'color': 'red' }
});
// <svg style="color: red">
```

__Note__ that dynamic node SSR (express & co) should work out of the box, but make sure to run your own performance / load tesing and cache as needed, since it's not a primary use case and rendering may be expensive.

## Inline styles mode

If you only use a few `fa-` utility classes here and there, or rely on inline styles for critical content, you can opt into inline styles mode with `inlineCss` option:

```js
fa('fas fa-camera fa-2x', { inlineCss: true })
// <svg style="display: inline-block;font-size: 2em;height: 1em;overflow: visible;vertical-align: -0.125em;width: 1em;">
```

This works by statically evaluating font-awesome styles for the given class and should support all `fa-*` utility classes and `styles` options. The downside is that you can only override the styles with `!important` or more inline `styles`, and might break some styling.

To use `fa-spin` or `fa-pulse`, include `unfont/css/faSpin.css` for the `@keyframes`. These styles can also be inlined into a `<style>` tag using a string exported from `require('unfont').faSpinCss`. It's a tiny CSS of 376 (120 gzip) bytes.

## Comparison with standard FA runtimes

A [benchmark](./benchmark) with 10 icons produces the following bundles:

|              | unfont inlineCss | unfont        | FA SVG + JS     | FA font        |
|--------------|------------------|---------------|-----------------|----------------|
| HTML / gzip  | 8.9 (2.9)        | 6.2 (2.9)     | 0.5 (0.3)       | 0.5 (0.3)      |
| CSS / gzip   | 0.4 (0.1)        | 7.8 (1.4)     |                 | 60 (13)        |
| JS / gzip    |                  |               | 43.2 (15.1)     |                |
| Woff2        |                  |               |                 | 168            |
| Total / gzip | __9.3 (3.1)__    | __14 (4.3)__  | __43.7 (15.3)__ | __228 (182)__  |

- Default `unfont` bundle is 3.5 times smaller than SVG + JS core version. No matter how many icons you have, you get rid of the 12.5K gzip JS runtime.
- Comparison with the font version is not even fair (50x difference).
- `inlineCss` version is another 1.5 times smaller than the default, or only 20% of SVG + JS core.
- Unfont displays the icons instantly, while both
- Both `unfont` setups generate 2.5K extra HTML, which is fine.

In a Slow 3G + 6x CPU Slowdown emulation without cache, icons are displayed @ 11s for font, 5s SVG + JS core, 4s unfont base, 2s unfont inlineCss. `unfont` only shows the page once the icons are ready, so no FOUC.

## Why not...

- `<img src="...">` / `background-image: url(...)` — generate a request per icon, FOUC while loading, difficult to style.
- __CSS data-URI__ — difficult to style.
- __Directly import FA SVG__ — can not add attributes and classes. Also, importing SVG from dynamic path in node is tricky.
- __SVG sprite in HTML__ — reduces raw HTML size, gzip already handles SVG duplication well. I have not seen a significant improvement in FCP / FMP, and. Also, harder to manage and prevents streaming HTML.
- __Remote SVG sprite__ — sounds like a decent option

---

Built by Vladimir Klepov [@thoughtspile](https://thoughtspile.github.io)

[MIT License](./LICENSE)