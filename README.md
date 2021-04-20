# content-slider

[![Size](https://img.shields.io/github/size/astrocaleb/content-slider/dist/content-slider.min.js)](https://www.npmjs.com/package/@astrocaleb/content-slider)
[![Dependencies](https://img.shields.io/david/astrocaleb/content-slider.svg)](https://www.npmjs.com/package/@astrocaleb/content-slider)

> Visually navigate between layered content without leaving the page.

## Getting started

```text
dist/
├── content-slider.js
├── content-slider.min.js
├── content-slider.css
└── content-slider.min.css
```

### Installation

```bash
# npm
npm i @astrocaleb/content-slider
```

In browser:

```html
<!-- not required unless `options.injectCSS` is set to `false` -->
<link href="/path/to/content-slider.css" rel="stylesheet">

<!-- not required if importing the `ContentSlider` module -->
<script src="/path/to/content-slider.js"></script>
```

## Usage

### HTML

This is the minimum markup required for using the default configuration.

```html
<div data-content-slider> <!-- Wrapper for this content slider instance -->
    <div data-cs-panes>   <!-- Content panes wrapper -->
        <div data-cs-pane data-breadcrumb-text="Pane 1">...</div>
        <div data-cs-pane data-breadcrumb-text="Pane 2">...</div>
    </div>
</div>
```

The following data attributes are required for each content slider instance:
- `data-content-slider` (only one per instance)
- `data-cs-panes` (only one per instance)
- `data-cs-pane` (as many as you need)
- *Only* if defining breadcrumb markup manually (see [examples](#examples)):
  - `data-cs-breadcrumbs` (only one per instance)
  - `data-slider-breadcrumb` (as many as you need)

### JS

```js
const slider = new ContentSlider(selector, options);
```

- **selector** (optional, but *highly* recommended)
  - Type: `String`
  - Default: `'[data-content-slider]'`
  - This is the wrapper selector for this specific instance.
  - It's highly recommended this is defined because it's required if you were to have more than one `ContentSlider` instance on the same page or if you are defining options.

- **options** (optional)
  - Type: `Object`
  - The options to control the individual content slider instance. Check out the available [options](#options).

### CSS

By default, every instance of `ContentSlider` attempts to inject styles directly into the head of the document if they don't exist already. **Because of this** you just need to use `options.css` for updating styles. Custom CSS options are applied to all `ContentSlider` instances because the existing styles defined in the head are overwritten with the custom CSS options.

**Note:** As of this version, if you want more control over styling and want to define the CSS file yourself, an option of `injectCSS` will need to be set to `false` for every new `ContentSlider` instance.

CSS variables are used (take note for browser support), and they are defined using the `html` selector. You can override them by targeting `:root` and define custom variable values. Example:

```css
:root {
    --cs-link: #da0000;
    --cs-link-hover: #ff0f0f;
    --cs-background: transparent;
}
```

Here are the default CSS variables used:

```css
html {
    --cs-background: #FFF;
    --cs-separator: "\276F";
    --cs-link-hue: 204;
    --cs-link-saturation: 82%;
    --cs-link-lightness: 36%;
    --cs-link: hsl(var(--cs-link-hue), var(--cs-link-saturation), var(--cs-link-lightness));
    --cs-link-hover: hsl(var(--cs-link-hue), var(--cs-link-saturation), calc(var(--cs-link-lightness) + 10%));
    --cs-transition-speed: 0.35s;
}
```

## Examples ([interactive examples](https://astrocaleb.github.io/content-slider/))

### Automatic Breadcrumb Creation

If you don't want to worry yourself with defining the breadcrumb markup and would like it to be dynamically generated, this is the best configuration for you.

**Note:** A unique `id` is automatically generated for each pane (each `data-cs-pane` element) unless defined in the markup manually. The `id`s are used by the breadcrumbs by default.

#### HTML

```html
<div data-content-slider class="my-content-slider">
    <div data-cs-panes>
        <div data-cs-pane data-breadcrumb-text="Pane 1">...</div>
        <div data-cs-pane data-breadcrumb-text="Pane 2">...</div>
    </div>
</div>
```

#### JS

```js
import ContentSlider from '@astrocaleb/content-slider';

// All default options
const slider = new ContentSlider('.my-content-slider');

// OR

// Use options to change how the content slider instance operates
const slider = new ContentSlider('.my-content-slider', {
    progressiveBreadcrumbs: true,
    callback: function() {
        alert("Pane is now visible!");
    }
});
```

You can also manually trigger showing a content pane using the `id` for a given pane. This requires manually defining an `id` per pane (each `data-cs-pane` element). Example:

#### HTML

```html
<div data-content-slider class="my-content-slider">
    <div data-cs-panes>
        <div data-cs-pane id="pane-1" data-breadcrumb-text="Pane 1">...</div>
        <div data-cs-pane id="pane-2" data-breadcrumb-text="Pane 2">...</div>
    </div>
</div>
```

#### JS

```js
const slider = new ContentSlider('.my-content-slider');
slider.showContentSliderPane('#pane-2');
```

The `showContentSliderPane` method accepts a pane `id` (required) but also optionally accepts a callback function, which overrides the [default callback option](#callback) from the constructor.

```js
const slider = new ContentSlider('.my-content-slider');
slider.showContentSliderPane('#pane-2', function() {
    alert("This pane was triggered manually!");
});
```

### Manual Breadcrumb Creation

If you need more control over the breadcrumbs markup, this is the where you want to start. The `data-cs-breadcrumbs` (breadcrumb wrapper) and `data-slider-breadcrumb` (each breadcrumb element) data attributes are **required** regardless of custom markup.

#### HTML

```html
<div data-content-slider class="my-content-slider">
    <div data-cs-breadcrumbs>
        <span data-cs-breadcrumb>Pane 1</span>
        <span data-cs-breadcrumb>Pane 2</span>
        <span data-cs-breadcrumb>Pane 3</span>
    </div>
    <div data-cs-panes>
        <div data-cs-pane>...</div>
        <div data-cs-pane>...</div>
        <div data-cs-pane>...</div>
    </div>
</div>
```

#### JS

```js
const slider = new ContentSlider('.my-content-slider', {
    automaticBreadcrumbs: false
});
```

## Options

- [`callback`](#callback)
- [`motion`](#motion)
- [`injectCSS`](#injectCSS)
- [`startingIndex`](#startingIndex)
- [`breadcrumbsEnabled`](#breadcrumbsEnabled)
- [`automaticBreadcrumbs`](#automaticBreadcrumbs)
- [`progressiveBreadcrumbs`](#progressiveBreadcrumbs)
- [`css`](#css)

### callback

- Type: `Function`
- Default: no-op

Callback that fires immediately after a pane comes into view.

### motion

- Type: `Boolean`
- Default: `true`

Disable this option to change the sliding animation to be a fade instead. This is helpful for accessibility concerns.

### injectCSS

- Type: `Boolean`
- Default: `true`

If this option is changed, it needs to be changed for all instances of `ContentSlider`. Even one instance using the default setting will inject the CSS into the head of the document.

If this is disabled, [`options.css`](#css) is no longer respected and you will need to leverage the CSS variables yourself. See the section above with the [available CSS variables](#css).

### startingIndex

- Type: `Number`
- Default: `0`

Change which pane is visible at time of render. This is a regular zero-based index.

### breadcrumbsEnabled

- Type: `Boolean`
- Default: `true`

This option is respected only when `automaticBreadcrumbs` is `true`.

### automaticBreadcrumbs

- Type: `Boolean`
- Default: `true`

When this is disabled the breadcrumbs are not rendered automatically. `breadcrumbsEnabled` is ignored if this is disabled.

### progressiveBreadcrumbs

- Type: `Boolean`
- Default: `false`

By default all breadcrumbs will render automatically. If this is `true` then breadcrumbs only automatically render after the first pane. Currently the only breadcrumbs that will render for each pane after the first will be:
- First pane breadcrumb (actionable back to first pane)
- Current pane breadcrumb (static text)

This option is respected only when `automaticBreadcrumbs` is `true`.

### css

- Type: `Object`
- Default: `{}` (inherits/merges with values from `cssDefaults`)

These are the values defined in `cssDefaults`:
```js
linkHue: '204',
linkSaturation: '82%',
linkLightness: '36%',
link: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), var(--cs-link-lightness))',
linkHover: 'hsl(var(--cs-link-hue), var(--cs-link-saturation), calc(var(--cs-link-lightness) + 10%))',
background: '#FFF',
separator: '\\276F', // Note the escaped backslash
transitionSpeed: 0.35 // seconds
```

**Note:** `transitionSpeed` is a number because of how it's used in the CSS string that's injected into the head of the document.

Example of the placeholder in the CSS template literal:

> ```js
> // ...
> transition: ${this.css.transitionSpeed}s all ease;
> // ...
> ```

`link` and `linkHover` are just colors and can be in any format.

Example of their placeholders in the CSS template literal:

> ```js
> html {
> // ...
> --cs-link: ${this.css.link};
> --cs-link-hover: ${this.css.linkHover};
> // ...
> }
> ```

And those CSS variables are used like this:

> ```js
> // ...
> [data-cs-breadcrumbs] [data-cs-breadcrumb] { color: var(--cs-link); }
> [data-cs-breadcrumbs] [data-cs-breadcrumb]:hover { color: var(--cs-link-hover); }
> // ...
> ```

## License

MIT
