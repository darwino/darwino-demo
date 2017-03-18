import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import reducer from './reducers/darwinoEntryStore.jsx'

// Bootstrap components
import 'babel-polyfill';
import 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Establish the store
const middleware = [ thunk ];
if(process.env.NODE_ENV !== "production") {
    middleware.push(createLogger());
}

const store = createStore(
        reducer,
        applyMiddleware(...middleware)
);

// App rendering
import Container from "./Container.jsx";

const app = document.getElementById('app');
ReactDOM.render(
        <Provider store={store}>
            <Container/>
        </Provider>
        , app
);