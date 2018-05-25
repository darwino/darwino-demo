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
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

import {
    Splitter, SplitterSide, SplitterContent
} from 'react-onsenui';

import { Navigator } from '@darwino/darwino-react-onsenui';
import Menu from './Menu';
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
                initialRoute={{page: 'views'}}
            />        
        );
    }
}
