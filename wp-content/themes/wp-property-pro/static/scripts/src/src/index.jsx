import React from 'react';
import {render} from 'react-dom';
import {browserHistory, IndexRoute, Router, Route} from 'react-router';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {syncHistoryWithStore} from 'react-router-redux';
import PropertiesSingleContainer from './components/properties/SingleContainer.jsx';
import MapSearchResults from './components/properties/MapSearchResults.jsx';
import PageLayout from './components/PageLayout.jsx';
import Page from './components/Page.jsx';
import Archive from './components/blog/Archive.jsx';
import GuideArchive from './components/guide/Archive.jsx';
import propertyProApp from './reducers/index.jsx';
import {Lib} from './lib.jsx';
import _ from 'lodash';
import shims from './shims.js';


// set up all relevant shims and polyfills for various browsers
shims();

let store = createStore(propertyProApp);

// Create an enhanced router history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);


render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={PageLayout}>
        <IndexRoute component={Page}/>
        {
          _.get(bundle, 'property_single_url', null)
            ? <Route path={"/" + _.get(bundle, 'property_single_url') + "/:propertySlug"} component={PropertiesSingleContainer}/>
            : null
        }
        {
          _.get(wpp, 'instance.settings.configuration.base_slug', null)
            ? <Route path={"/" + _.get(wpp, 'instance.settings.configuration.base_slug')} component={MapSearchResults}/>
            : null
        }
        {
          _.get(bundle, 'blog_base', null)
            ? <Route path={"/" + _.get(bundle, 'blog_base').replace(/\//g, '')} component={Archive}/>
            : null
        }
        {
          _.get(bundle, 'category_base', null)
            ? <Route path={"/" + _.get(bundle, 'blog_base').replace(/\//g, '') + "/:categoryTitle"}
                     component={Archive}/>
            : null
        }
        {
          _.get(bundle, 'guide_category_base', null)
            ? <Route path={"/" + _.get(bundle, 'guide_category_base').replace(/\//g, '') + "/:guideCategoryTitle"}
                     component={GuideArchive}/>
            : null
        }
        <Route path="*" component={Page}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById(Lib.THEME_CLASSES_PREFIX + 'root')
);
