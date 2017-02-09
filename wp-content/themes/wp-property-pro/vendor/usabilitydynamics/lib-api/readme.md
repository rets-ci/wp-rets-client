## Features
* Creates admin-ajax.php handler for defined actions.
* Creates XML-RPC handler for defined actions.
* Enforces RESTful URL structures.

## Usage

```php
// Available at: GET http://website.com/wp-admin/admi-ajax.php?action=/my/action
API::define( '/my/action', array(
  'version'  => 1.0,
  'handler' => function() {
    API::send( array( 'ok' => true, 'message' => 'API Key action.' ));
  }
));

```php

## Filters
* usabilitydynamics::api::get_id
* usabilitydynamics::api::get_path
* usabilitydynamics::api::get_url
* usabilitydynamics::api::get_route

## License

(The MIT License)

Copyright (c) 2014 Usability Dynamics, Inc. &lt;info@usabilitydynamics.com&gt;

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