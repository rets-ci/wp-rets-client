import React from 'react';
import {render} from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import PageLayout from './components/PageLayout.jsx';
import propertyProApp from './reducers/index.jsx';
import {Lib} from './lib.jsx';
import shims from './shims.js';

import 'swiper-css';
import 'index.scss';

// set up all relevant shims and polyfills for various browsers
shims();


let devEnv = process && process.env && process.env.NODE_ENV === 'development';
let store;

// // service worker
// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register('/sw.js').then(function(registration) {
//     console.log('ServiceWorker registration successful with scope:',  registration.scope);
//   }).catch(function(error) {
//     console.log('ServiceWorker registration failed:', error);
//   });
// }

if (devEnv) {
  store = createStore(
    propertyProApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
} else {
  store = createStore(
    propertyProApp
  );
}

render(
  <Provider store={store}>
    <Router>
      <Route path="*" component={PageLayout} />
    </Router>
  </Provider>,
  document.getElementById(Lib.THEME_CLASSES_PREFIX + 'root')
);
