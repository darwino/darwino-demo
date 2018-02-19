/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import { HashRouter as Router, Route } from "react-router-dom";

import { Provider } from 'react-redux'
import { IntlProvider, addLocaleData } from 'react-intl'
import { reducer as reduxFormReducer } from 'redux-form';
import { I18N } from '@darwino/darwino'
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


//
// Translations
//

// Strings for React-Intl
import ri_messages_en from "./i18n/ri_messages_en"
I18N.addMessages("en",ri_messages_en);
import ri_messages_fr from "./i18n/ri_messages_fr"
I18N.addMessages("fr",ri_messages_fr);

// Strings for _t()
import messages_en from "./i18n/messages_en"
I18N.addMessages("en",messages_en);
import messages_fr from "./i18n/messages_fr"
I18N.addMessages("fr",messages_fr);


import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
addLocaleData(enLocaleData);
addLocaleData(frLocaleData);

class MainApp extends Component {
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
    }
    render() {
        if(!this.state.intlLoaded) {
            return <div/>
        }
        // The key is IntlProvider trigger a re-render of the app when the Locale changes
        // See: https://github.com/yahoo/react-intl/wiki/Components#intlprovider 
        //   Dynamic Language Selection 
        // Also see: https://github.com/yahoo/react-intl/issues/243
        const msg = I18N.getMessages()
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

const app = document.getElementById('app');
ReactDOM.render(<MainApp/>, app);