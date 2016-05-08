

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

## Success Pages

The current forms redirect users to a success page upon submitting the form. This is configured via the hidden `ignore_redirecturl` parameter in the form settings.

Buy Inquiry (home-buying, home-buying-listing)
https://www.reddoorcompany.com/buy/inquiry-success

Rent Inquiry (home-renting, home-renting-listing)
https://www.reddoorcompany.com/rent/inquiry-success

Rent Application (request-application)
https://www.reddoorcompany.com/rent/application-success

Sell Inquiry (home-selling)
https://www.reddoorcompany.com/sell/inquiry-success

Management Inquiry (home-management)
https://www.reddoorcompany.com/management/inquiry-success

Contact Inquiry (related issue at #374)
https://www.reddoorcompany.com/about/inquiry-success

Career Inquiry (related issue at #382) 
https://www.reddoorcompany.com/about/careers/inquiry-success