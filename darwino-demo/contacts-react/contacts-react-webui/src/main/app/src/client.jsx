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
import { IntlProvider, addLocaleData } from 'react-intl'
import { reducer as reduxFormReducer } from 'redux-form';
import { I18N } from '@darwino/darwino';
import { StoreReducers } from '@darwino/darwino-react'

import promiseMiddleware from 'redux-promise';

//import Rollbar from "rollbar";

// Polyfills
// import Promise from 'promise-polyfill'; 
// if (!window.Promise) {
//   window.Promise = Promise;
// }
//import 'babel-polyfill';
//import 'whatwg-fetch'

import 'font-awesome/css/font-awesome.css';
import 'bootswatch/paper/bootstrap.min.css';
//import 'bootswatch/simplex/bootstrap.min.css';

// Custom styles
import './style/navbar-fixed-side.css';
import './style/style.css'; 

import Layout from "./js/pages/Layout";

// App rendering
import {initDevOptions} from '@darwino/darwino';

// Localization
import ri_messages_en from "./js/i18n/ri_messages_en"
import ri_messages_fr from "./js/i18n/ri_messages_fr"
import messages_en from "./js/i18n/messages_en"
import messages_fr from "./js/i18n/messages_fr"
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';


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

const { DarwinoQueryStoreReducer, DarwinoDocumentStoreReducer } = StoreReducers
//const USE_ROLLBAR = false;

// Redux dev tools
let composeEnhancers;
// if(process.env.NODE_ENV!="production") {
//     composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//     initDevOptions("http://localhost:8080/contacts-react/")
// } else {
//     composeEnhancers = compose;
// }
if(process.env.NODE_ENV!=="production") {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    initDevOptions("http://localhost:8080/")
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


//
// Translations
//

// Strings for React-Intl
I18N.addMessages("en",ri_messages_en);
I18N.addMessages("fr",ri_messages_fr);

// Strings for _t()
I18N.addMessages("en",messages_en);
I18N.addMessages("fr",messages_fr);

// React intl classes
addLocaleData([...enLocaleData, ...frLocaleData]);

export class MainApp extends Component {
    constructor(props) {
        super(props);
        // We do not display the page until we know the actual locale
        // This avoids a first default rendering and then the desired one
        this.state = {intlLoaded: false}
        I18N.loadServerContext();
        I18N.addListener(() => {
            if(!this.state.intlLoaded) {
                this.setState({intlLoaded: true})
            } else {
                this.forceUpdate()
            }
        });

        // Install the Rollback config
        // if(USE_ROLLBAR) {
        //     new MicroServices()
        //         .name("RollbarConfig")
        //         .fetch()
        //         .then((config) => {
        //             if(config.enabled) {
        //                 window.rollbar = new Rollbar(config);
        //                 rollbar.configure({payload:config.payload});
        //             }
        //         });
        // }
    }
    render() {
        if(!this.state.intlLoaded) {
            return <div/>
        }
        // The key is IntlProvider trigger a re-render of the app when the Locale changes
        // See: https://github.com/yahoo/react-intl/wiki/Components#intlprovider 
        //   Dynamic Language Selection 
        // Also see: https://github.com/yahoo/react-intl/issues/243
        return (
            <Provider store={createStore(darwinoReducer,composeEnhancers(applyMiddleware(promiseMiddleware)))}>
                <IntlProvider locale={I18N.getLocale()} key={I18N.getLocale()} messages={I18N.getMessages()}>
                    <Router>
                        <Route path="/" render={() => <Layout renderingOptions={renderingOptions}/>}/>
                    </Router>
                </IntlProvider>        
            </Provider>
        )
    }
}
