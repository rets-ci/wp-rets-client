import {addPost, initMenu, setSearchProps} from './actions/index.jsx';
import FrontPage from './components/front-page/Index.jsx'
import FrontPageLayout from './components/front-page/Layout.jsx';
import MapSearchResults from './components/properties/MapSearchResults.jsx';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {browserHistory, IndexRoute, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import propertyProApp from './reducers/index.jsx';
import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';

const middleware = applyMiddleware(ReduxThunk);

let store = createStore(propertyProApp, middleware);

store.dispatch(initMenu(bundle.menuItems));
store.dispatch(addPost(bundle.post));
store.dispatch(setSearchProps([]));

// Create an enhanced router history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={FrontPageLayout}>
        <IndexRoute component={FrontPage} />
      </Route>
      <Route path="/:sale/:tax/:term" component={MapSearchResults} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
