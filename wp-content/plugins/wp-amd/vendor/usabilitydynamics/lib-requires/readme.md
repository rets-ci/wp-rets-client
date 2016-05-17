## Concepts

 - Requires will only produce a single script tag per page request, but multiple may be supported in the future.

## WordPress Concepts
* Only footer scripts are converted to AMD, header scripts assumed to be necessary for <body> to render, and are blocking.
* The AMD configuration is stored in app.config.js.
* Each script's localization data is loaded via app.locale.js. Traditional global variables are honored in addition to be each locale setting object being wrapped into define()
* Recognized AMD scripts are stored in options table.
* Recognized AMD scripts are dequed from footer (wp_print_footer_scripts) only if they are loaded prior to "template_redirect" action.
*

Config Properties
The app.config.js file includes:
* baseUrl - Relative URL to assets, typically simply /assets.
* paths - Reference to paths of all enqueued scripts via wp_enqueue_script() and dependencies that are not available via UDX CDN.
* deps - All enqueued scripts that should be loaded on initialization, e.g. 'jquery', 'jquery.accordion', 'menufication-js', etc.
* shim - Dependencies of enqueued scripts.
* config - Object containing all custom configuration such as Analytics ID, Locale Strings, Menufication settings, etc. This configuration does not take user session or application state into consideration.

## Size
The size of the main http://cdn.udx.io/udx.requires.js file is:
* 11.1 KB - Minified and GZipped.
* 17.7 KB - Minified.
* 69.8 KB - Unminified.

### Shims

* Object.extend
* Object.defineSchema
* Object.validateSchema
* Object.create
* Object.defineProperty
* Object.defineProperties
* Object.getOwnPropertyDescriptor
* Object.getOwnPropertyNames

## Usage

### Initialize Require Client

* data-id
* data-name
* data-base-url
* data-model
* data-version - Will append a "ver=X.X" version to each requested script.
* data-config - JSON configuration string, may otherwise be set as inner-content of the <script> tag.
* data-main
* data-status - (loading|ready|error)
* data-requiremodule
* data-requirecontext
* data-requires / data-require / data-enqueue

### Initialize WordPress Handler

```php
// Initialize.
$_requires = new \UsabilityDynamics\Requires;

// Configure..
$_requires->set(array(
  'paths' => '/scripts/app.state.js',
  'scopes' => 'public',
  'debug' => true
)));

// Define Libraries.
$_requires->add( 'udx.knockout' );
$_requires->add( 'wpp.ui.supermap' );
$_requires->add( 'wpp.ui.admin.settings' );

// Render HTML tag.
$_requires->render_tag();
```

### In Header

```html
<script data-debug="true" src="//cdn.udx.io/requires.js"></script>
```

### In Body

```html
<div data-requires="udx.wp-property.supermap"></div>
<div data-requires="udx.elastic-filter"></div>
<div data-requires="crowdfavorite.carrington-build.slider"></div>
<div data-requires="bootstrap.carousel"></div>
```

## License

(The MIT License)

Copyright (c) 2013 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.