/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";

import ons from "onsenui";

import {
    Fab,
    Icon,
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
        this.renderFixed = this.renderFixed.bind(this);
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
        const actions = !ons.platform.isAndroid() && {type:"new",handler:this.newDocument};
        return (
            <NavBar title={titles[this.props.tabIndex]} action={actions}/>
        );
    }
    renderFixed() {
        const f = this.newDocument;
        return ons.platform.isAndroid() && 
                    <Fab
                        onClick={this.newDocument}
                        position='bottom right'>
                        <Icon icon='md-plus' />                        
                    </Fab>
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
            <Page 
                renderToolbar={this.renderToolbar}
                renderFixed={this.renderFixed}>
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

