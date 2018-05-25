/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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

// Load hybrid so it gets initialized early
import {Hybrid} from "@darwino/darwino";


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
