import createHistory from 'history/createBrowserHistory';
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
import _ from 'lodash';
import shims from './shims.js';

require('swiper-css');

// set up all relevant shims and polyfills for various browsers
shims();


let devEnv = process && process.env && process.env.NODE_ENV === 'development';
let store;

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

// Create an enhanced router history that syncs navigation events with the store
const history = createHistory()
history.listen((location, action) => {
  window.scrollTo(0, 0);
  let ourStore = store.getState();
  if (ourStore.errorMessage) {
    store.dispatch({
      type: Lib.RESET_ERROR_MESSAGE_ACTION
    });
  }
  store.dispatch({
    type: Lib.ROUTE_CHANGED_ACTION
  });
});

render(
  <Provider store={store}>
    <Router>
      <Route path="*" component={PageLayout} />
    </Router>
  </Provider>,
  document.getElementById(Lib.THEME_CLASSES_PREFIX + 'root')
);
