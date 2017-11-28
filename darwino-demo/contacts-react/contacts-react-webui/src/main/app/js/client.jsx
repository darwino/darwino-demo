/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { HashRouter as Router, Route } from "react-router-dom";

import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { reducer as reduxFormReducer } from 'redux-form';
import { StoreReducers } from '@darwino/darwino-react'
const { DarwinoQueryStoreReducer, DarwinoDocumentStoreReducer } = StoreReducers

import promiseMiddleware from 'redux-promise';

// Polyfills
import Promise from 'promise-polyfill'; 
if (!window.Promise) {
  window.Promise = Promise;
}
import 'babel-polyfill';
import 'whatwg-fetch'

import 'font-awesome/css/font-awesome.css';

// test
//
// Use a Bootstrap theme
// Can be the default bootstrap, a bootswatch one (https://bootswatch.com/), or any other!

// const renderingOptions = {
//     headerInverted: true,
//     footerInverted: false,
//     leftnavInverted: false,
// }
//import 'bootstrap/dist/css/bootstrap.css';

// const renderingOptions = {
//     headerInverted: true,
//     footerInverted: false,
//     leftnavInverted: false,
// }
// import 'bootswatch/superhero/bootstrap.min.css';

const renderingOptions = {
    headerInverted: true,
    footerInverted: false,
    leftnavInverted: false,
}
import 'bootswatch/paper/bootstrap.min.css';

//import 'bootswatch/simplex/bootstrap.min.css';



// Custom styles
import '../style/navbar-fixed-side.css';
import '../style/style.css'; 

import Layout from "./pages/Layout";

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
    <IntlProvider locale="en">
        <Provider store={createStore(darwinoReducer,composeEnhancers(applyMiddleware(promiseMiddleware)))}>
            <Router>
                <Route path="/" render={() => <Layout renderingOptions={renderingOptions}/>}/>
            </Router>
        </Provider>
    </IntlProvider>        
    , app
);