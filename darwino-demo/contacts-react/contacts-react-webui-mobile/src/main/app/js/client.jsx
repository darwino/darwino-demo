/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { reducer as reduxFormReducer } from 'redux-form';
import { StoreReducers } from '@darwino/darwino-react'
const { DarwinoQueryStoreReducer, DarwinoDocumentStoreReducer } = StoreReducers

import promiseMiddleware from 'redux-promise';

import App from "./App";


// Polyfills
import Promise from 'promise-polyfill'; 
if (!window.Promise) {
  window.Promise = Promise;
}
import 'babel-polyfill';
import 'whatwg-fetch'

// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

// Custom styles
import '../style/style.css'; 

// App rendering
import {DEV_OPTIONS,initDevOptions} from '@darwino/darwino';

// Redux dev tools
let composeEnhancers;
if(process.env.NODE_ENV!="production") {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    initDevOptions("http://localhost:8080/contacts-react/")
} else {
    composeEnhancers = compose;
}
const darwinoReducer = combineReducers({
    queries: DarwinoQueryStoreReducer,
    documents: DarwinoDocumentStoreReducer,
    form: reduxFormReducer
})

const app = document.getElementById('app');

ReactDOM.render(
    <IntlProvider locale="en">
        <Provider store={createStore(darwinoReducer,composeEnhancers(applyMiddleware(promiseMiddleware)))}>
            <App/>
        </Provider>
    </IntlProvider>       
    , app
);
