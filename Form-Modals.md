

## Available Forms for Modal

* popupManage
* popupSellHome
* popupRentHomeListing
* popupRentHome
* popupBuyHomeListing 
* popupBuyHome

### Text Links

```html
<a class="showContactPopup" href="#" rel="popupSellHome">Show Selling</a>
```

### Button Elements

You may also use a `<button>` element, except instead of `rel` we use `data-action` because WordPress strips the `rel` from buttons, like so:

```html
<button class="showContactPopup" data-action="popupSellHome">Show some popup</button>
```

