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
import PropTypes from 'prop-types';

import {
    Page,
    Splitter, SplitterSide, SplitterContent
} from 'react-onsenui';

import Menu from './Menu';

export default class PageWithMenu extends Component {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };

    // We make the navigator globally available, similarly to react-navigator
    static childContextTypes = {
        layout: PropTypes.object
    };
    getChildContext() {
        return {layout: this};
    }
    

    constructor(props,context) {
        super(props,context);
        this.showLeftMenu = this.showLeftMenu.bind(this)
        this.state = {
            leftMenuOpen: false
        }
    }

    showLeftMenu(show) {
        if(this.state.leftMenuOpen!=show) {
            this.setState({leftMenuOpen: show});
        }
    }

    render() {
        const {...props} = this.props;
        return (
            <Page {...props}>
                <Splitter>
                    <SplitterSide
                        style={{
                            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                        }}
                        side='left'
                        width={300}
                        collapse={true}
                        // This does not initially render properly 
                        //collapse={"(max-width: 640px)"}
                        swipeable={true}
                        isOpen={this.state.leftMenuOpen}
                        onClose={() => this.showLeftMenu(false)}
                        onOpen={() => this.showLeftMenu(true)}>
                        <Menu navigator={this.context.navigator} layoutPage={this} showLeftMenu={this.showLeftMenu}/>
                    </SplitterSide>
                    <SplitterContent>
                        {this.props.children}
                    </SplitterContent>
                </Splitter>    
            </Page>    
        );
    }
}
