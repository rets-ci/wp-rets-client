

## Available Forms for Modal

* popupFormOptions
* popupFormBuyInquiryListing
* popupFormBuyInquiry
* popupFormCareerInquiry
* popupFormContactInquiry
* popupFormManagementInquiry
* popupFormManagementReferral
* popupFormRentApplication
* popupFormRentInquiry
* popupFormSellInquiry
* popupNoticeRentPass

### Text Links

```html
<a class="showContactPopup" href="#popupFormManagementInquiry">Show ManagementInquiry Popup</a>
```

### Button Elements

You may also use a `<button>` element, except instead of `rel` we use `data-action` because WordPress strips the `rel` from buttons, like so:

```html
<button class="showContactPopup" data-action="popupFormSellInquiry">Show Sell Inquiry Popup</button>
```

## Success Pages

The current forms redirect users to a success page upon submitting the form. This is configured via the hidden `ignore_redirecturl` parameter in the form settings.

Buy Inquiry 
`https://www.reddoorcompany.com/buy/inquiry-success`

Rent Inquiry 
`https://www.reddoorcompany.com/rent/inquiry-success`

Rent Application
`https://www.reddoorcompany.com/rent/application-success`

Sell Inquiry
`https://www.reddoorcompany.com/sell/inquiry-success`

Management Inquiry
`https://www.reddoorcompany.com/management/inquiry-success`

Contact Inquiry
`https://www.reddoorcompany.com/about/inquiry-success`

Career Inquiry
`https://www.reddoorcompany.com/about/careers/inquiry-success`