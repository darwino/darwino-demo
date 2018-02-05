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