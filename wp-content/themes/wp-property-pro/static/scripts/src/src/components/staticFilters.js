let bathroom = [
  {name: '0+', value: '0'},
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'},
  {name: '5+', value: '5'},
  {name: '6+', value: '6'}
];

let bedroom = [
  {name: '0+', value: '0'},
  {name: '1+', value: '1'},
  {name: '2+', value: '2'},
  {name: '3+', value: '3'},
  {name: '4+', value: '4'},
  {name: '5+', value: '5'},
  {name: '6+', value: '6'}
];

let defaultPropertyFilters = {
  bedrooms: '0',
  bathrooms: '0',
  price: {
    start: 'No Min',
    to: 'No Max'
  },
  sqft: {
    start: 'No Min',
    to: 'No Max'
  },
  lotSize: {
    start: 'No Min',
    to: 'No Max'
  }
};
export {
  bathroom,
  bedroom,
  defaultPropertyFilters,
};
