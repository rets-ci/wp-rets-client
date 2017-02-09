### Classes

* \UsabilityDynamics\Theme\Scaffold
* \UsabilityDynamics\Theme\Customizer
* \UsabilityDynamics\Theme\Script
* \UsabilityDynamics\Theme\Style

### Usage

```php
// Create Theme class with Scaffolding.
class MyTheme extends \UsabilityDynamics\Theme\Scaffold {

  public function __construct() {

    $this->settings();
    $this->dynamic();
    $this->rewrites();
    $this->api();
    $this->media();
    $this->customizer();
    $this->upgrade();
    $this->supports();

  }

}
```
