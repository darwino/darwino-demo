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

import React, {Component} from "react";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { HashRouter as Router, Route } from "react-router-dom";

import { Provider } from 'react-redux'
import { reducer as reduxFormReducer } from 'redux-form';
import { StoreReducers } from '@darwino/darwino-react'

import promiseMiddleware from 'redux-promise';

import 'font-awesome/css/font-awesome.css';

import 'bootstrap/dist/css/bootstrap.min.css';

// Custom styles
import '../style/navbar-fixed-side.css';
import '../style/style.css'; 

import Layout from "./pages/Layout";

// App rendering
import {initDevOptions} from '@darwino/darwino';

const { DarwinoQueryStoreReducer, DarwinoDocumentStoreReducer } = StoreReducers

// Redux dev tools
let composeEnhancers;
if(process.env.NODE_ENV!=="production") {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    initDevOptions("http://localhost:8080/","ws://localhost:8080/")
    console.log("initDevOptions");
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

export class MainApp extends Component {
    render() {
        return (
            <Provider store={createStore(darwinoReducer,composeEnhancers(applyMiddleware(promiseMiddleware)))}>
                <Router>
                    <Route path="/" render={() => <Layout/>}/>
                </Router>
            </Provider>
        )
    }
}
