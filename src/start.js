import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import reduxPromise from 'redux-promise'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'

import {initSocket} from './socket'
import reducer from './redux/reducers'

import Welcome from './components/Welcome'
import App from './components/App'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)))

let toRender

if (location.pathname === '/welcome') {
    toRender = <Welcome />
} else {
    toRender = (initSocket(store),
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(
    toRender,
    document.querySelector('main')
)
