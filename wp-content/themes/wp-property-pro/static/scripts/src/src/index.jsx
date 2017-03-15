import {addPost, initMenu, setSearchProps} from './actions/index.jsx';
import MapSearchResults from './components/properties/MapSearchResults.jsx';
import PageLayout from './components/PageLayout.jsx';
import PageContent from './components/PageContent.jsx';
import Util from './components/Util.jsx';
import _ from 'lodash';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {browserHistory, IndexRoute, Router, Route} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import propertyProApp from './reducers/index.jsx';
import {createStore} from 'redux';

let store = createStore(propertyProApp);

store.dispatch(addPost(bundle.post));
store.dispatch(setSearchProps([]));

// Create an enhanced router history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// TODO temporary comment this, until done with elastic search API
// <Route path="/:sale/:tax/:term" component={MapSearchResults} />

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={PageLayout}>
        <IndexRoute component = {PageContent} />
        <Route path={"/" + _.get(wpp, 'instance.settings.configuration.base_slug')} component={MapSearchResults} />
        <Route path="*" component={PageContent} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
