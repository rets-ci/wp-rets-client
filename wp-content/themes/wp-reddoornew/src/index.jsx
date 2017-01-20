import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reddoorApp from './reducers/index.jsx'
import {addPost, initMenu} from './actions/index.jsx'
import App from './components/App.jsx'

let store = createStore(reddoorApp);

store.dispatch(initMenu(bundle.menuItems));
store.dispatch(addPost(bundle.post));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)