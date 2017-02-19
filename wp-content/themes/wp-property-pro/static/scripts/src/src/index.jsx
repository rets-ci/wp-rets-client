import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, IndexRoute, Router, Route } from 'react-router';
import { syncHistoryWithStore} from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import SearchResult from './components/SearchResult.jsx';
import propertyProApp from './reducers/index.jsx';
import {addPost, initMenu, setSearchProps} from './actions/index.jsx';
import Home from './components/Home.jsx'
import HomeLayout from './components/HomeLayout.jsx';

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
      <Route path="/" component={HomeLayout}>
        <IndexRoute component={Home} />
      </Route>
      <Route path="/search-result" component={SearchResult} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
