import React from "react";
import { Link } from "react-router";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Breweries from "./pages/Breweries.jsx";
import Layout from "./pages/Layout.jsx";

export default class Container extends React.Component {

    render() {
        /*
         * 
                        <Route path="archives(/:article)" name="archives" component={Archives}></Route>
                        <Route path="settings" name="settings" component={Settings}></Route>
         */
        return (
                <Router history={hashHistory}>
                    <Route path="/" component={Layout}>
                        <IndexRoute component={Breweries}/>
                    </Route>
                </Router>
        );
    }
}