/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";

import ons from "onsenui";

import {
    Page,
    Toolbar,
    Tabbar, Tab
} from 'react-onsenui';

import NavBar from "./NavBar";
import AllContacts from "./AllContacts";
import AllCompanies from "./AllCompanies";

export default class MainViewPage extends Component {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };
    
    constructor(props,context) {
        super(props,context);
        this.renderToolbar = this.renderToolbar.bind(this);
        this.newDocument = this.newDocument.bind(this);
    }

    newDocument() {
        switch(this.props.tabIndex) {
            case 0:     this.context.navigator.pushPage({page:"contact"}); return;
            case 1:     this.context.navigator.pushPage({page:"company"}); return;
        }
    }

    renderToolbar() {
        const titles = ['Contacts', 'Companies'];
        return (
            <NavBar title={titles[this.props.tabIndex]} action={{type:"new",handler:this.newDocument}}/>
        );
    }

    renderTabs() {
        return [
          {
            content: <AllContacts/>,
            tab: <Tab label='Contacts' icon='fa-users' />
          },
          {
            content: <AllCompanies/>,
            tab: <Tab label='Companies' icon='fa-industry' />
          }
        ];
    }
        
    render() {
        return (
            <Page renderToolbar={this.renderToolbar}>
                <Tabbar
                    swipeable={true}
                    position='auto'
                    index={this.props.tabIndex}
                    onPreChange={(event) => {
                        this.context.navigator.replacePage({page:'views', props:{tabIndex:event.index}});
                    }}
                    renderTabs={this.renderTabs}
                />
            </Page>            
        );
    }
}

