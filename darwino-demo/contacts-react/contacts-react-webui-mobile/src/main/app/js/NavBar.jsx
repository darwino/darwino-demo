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

import ons from 'onsenui';
import {
    Toolbar,
    ToolbarButton,
    Icon,
    BackButton
} from 'react-onsenui';
  
class NavBar extends Component {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object,
        layout: PropTypes.object
    };

    constructor(props,context) {
        super(props,context);
    }

    showLeftMenu(show) {
        if(this.context.layout) {
            this.context.layout.showLeftMenu(show);
        }
    }

    renderAction(action) {
        if(action.type=="save") {
            if(ons.platform.isAndroid()) {
                return <div className='right'><ToolbarButton onClick={action.handler}><Icon icon='md-save'/></ToolbarButton></div>
            }
            return <div className='right'><ToolbarButton onClick={action.handler}>Save</ToolbarButton></div>
        }
        if(action.type=="new") {
            if(ons.platform.isAndroid()) {
                // Use a floating button?
                return null;
            }
            return <div className='right'><ToolbarButton onClick={action.handler}>New</ToolbarButton></div>
        }
        return null;
    }

    render() {
        const {title, backButton, menuButton, action} = this.props;
        return (
            <Toolbar>
                <div className='left'>
                    {menuButton && <ToolbarButton onClick={() => this.showLeftMenu(true)}><Icon icon="ion-navicon, material:md-menu" size={{default:32, material:24}}></Icon></ToolbarButton> }
                    {backButton && <BackButton onClick={() => this.context.navigator.popPage()}>Back</BackButton> }
                </div>
                <div className='center'>{title}</div>
                {action && this.renderAction(action)}
            </Toolbar>
        )
    }
}

export default NavBar;