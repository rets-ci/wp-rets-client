import {addPost, initMenu, setSearchProps} from './actions/index.jsx';
import PageLayout from './components/PageLayout.jsx';
import PageContent from './components/PageContent.jsx';
import MapSearchResults from './components/properties/MapSearchResults.jsx';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {browserHistory, IndexRoute, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import propertyProApp from './reducers/index.jsx';
import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import Util from './components/Util.jsx';

const middleware = applyMiddleware(ReduxThunk);

let store = createStore(propertyProApp, middleware);

store.dispatch(initMenu(bundle.menuItems));
store.dispatch(addPost(bundle.post));
store.dispatch(setSearchProps([]));

// Create an enhanced router history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

history.listen(
  location => Util.getPageContent(location.pathname, (data) => {
    store.dispatch(addPost(data.post))
  })
);

render(
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={PageLayout} >
          <IndexRoute component = {PageContent} />
          <Route path="/:sale/:tax/:term" component={MapSearchResults} />
          <Route path="*" component={PageContent} />
        </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
