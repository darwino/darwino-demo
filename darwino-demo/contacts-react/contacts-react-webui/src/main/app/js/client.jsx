/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { HashRouter as Router, Route } from "react-router-dom";

import { Provider } from 'react-redux'
import { reducer as reduxFormReducer } from 'redux-form';
import { DarwinoQueryStoreReducer, DarwinoDocumentStoreReducer } from './darwino-react/reducers/jsonStoreReducer.jsx'

import promiseMiddleware from 'redux-promise';

// Polyfills
import Promise from 'promise-polyfill'; 
if (!window.Promise) {
  window.Promise = Promise;
}
import 'babel-polyfill';
import 'whatwg-fetch'

import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap';

// Custom styles
import '../style/navbar-fixed-side.css';
import '../style/style.css'; 

import Layout from "./pages/Layout.jsx";

// App rendering
import {DEV_OPTIONS,initDevOptions} from './darwino-react/util/dev.js';

// Development tools
const DEVELOPMENT = true;

// Redux dev tools
const composeEnhancers = DEVELOPMENT ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
if(DEVELOPMENT) {
    initDevOptions(DEVELOPMENT,"http://localhost:8080/contacts-react/")
}

// Establish the store
// const createStoreWithMiddleWare = applyMiddleware(
// 	promiseMiddleware
// )(createStore);

const darwinoReducer = combineReducers({
    queries: DarwinoQueryStoreReducer,
    documents: DarwinoDocumentStoreReducer,
    form: reduxFormReducer
})

const app = document.getElementById('app');

ReactDOM.render(
    <Provider store={createStore(darwinoReducer,composeEnhancers(applyMiddleware(promiseMiddleware)))}>
        <Router>
            <Route path="/" component={Layout}/>
        </Router>
    </Provider>
    , app
);