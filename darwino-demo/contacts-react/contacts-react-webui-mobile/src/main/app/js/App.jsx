/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import ReactDOM from "react-dom";

import { Navigator } from '@darwino/darwino-react-onsenui';
import MainViewPage from './MainViewPage';
import Contact from './Contact';
import Company from './Company';

export default class App extends Component {

    constructor(props) {
        super(props)
        this.renderPage = this.renderPage.bind(this);
    }

    renderPage(route, navigator) {
        const page = route.page
        if(page=="views") {
            return <MainViewPage {...route.props}/>
        }
        if(page=="contact") {
            return <Contact {...route.props}/>
        }
        if(page=="company") {
            return <Company {...route.props}/>
        }
        return <div>Invalid route!!! page={page}, props=</div>
    }

    render() {
        return (
            <Navigator
                renderPage={this.renderPage}
                initialRoute={{page: 'views', props:{tabIndex: 0}}}
            />            
        );
    }
}
