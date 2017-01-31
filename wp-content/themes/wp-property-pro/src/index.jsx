import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import propertyProApp from './reducers/index.jsx'
import {addPost, initMenu} from './actions/index.jsx'
import App from './components/App.jsx'
import History from 'react-history/BrowserHistory'

let store = createStore(propertyProApp);

store.dispatch(initMenu(bundle.menuItems));
store.dispatch(addPost(bundle.post));

render(
    <Provider store={store} history={History} >
        <App />
    </Provider>,
    document.getElementById('root')
)