/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import {Hybrid} from "@darwino/darwino";

import ons from "onsenui";

import {
    Fab,
    Icon,
    Tabbar, Tab
} from 'react-onsenui';

import PageWithMenu from './PageWithMenu';
import NavBar from "./NavBar";

import AllContacts from "./AllContacts";
import AllCompanies from "./AllCompanies";

export default class MainViewPage extends Component {

    // Context to read from the parent - navigator
    static contextTypes = {
        navigator: PropTypes.object
    };

    // This does not need to be a state as we don't want to redraw when it changes
    tabIndex=0

    constructor(props,context) {
        super(props,context);
        this.renderToolbar = this.renderToolbar.bind(this);
        this.renderFixed = this.renderFixed.bind(this);
        this.newDocument = this.newDocument.bind(this);
        this.tabIndex = this.props.tabIndex||0;
    }

    setTabIndex(tabIndex) {
        this.tabIndex = tabIndex;
        this.forceUpdate();
    }

    newDocument() {
        switch(this.tabIndex) {
            case 0:     this.context.navigator.pushPage({page:"contact"}); return;
            case 1:     this.context.navigator.pushPage({page:"company"}); return;
        }
    }

    renderToolbar() {
        const titles = ['Contacts', 'Companies'];
        const actions = !ons.platform.isAndroid() && {type:"new",handler:this.newDocument};
        return (
            <NavBar title={titles[this.tabIndex]} menuButton={true} action={actions}/>
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
        let tabs = [
          {
            content: <AllContacts key={0}/>,
            tab: <Tab key={0} label='Contacts' icon='fa-users' />
          },
          {
            content: <AllCompanies key={1}/>,
            tab: <Tab key={1} label='Companies' icon='fa-industry' />
          }
        ];
        if(Hybrid.isHybrid()) {
            tabs.push({
                content: <div key={2}/>, // null disables the tab
                tab: <Tab key={2} label='Settings' icon='fa-cog' />
            })
        }
        return tabs;
    }

    render() {
        return (
            <PageWithMenu 
                renderToolbar={this.renderToolbar}
                renderFixed={this.renderFixed}>
                <Tabbar
                    swipeable={true}
                    position='auto'
                    index={this.tabIndex}
                    onPreChange={(event) => {
                        if(event.index==2) {
                            Hybrid.openSettings();
                            event.cancel(); // Do not change the tab
                        } else {
                            this.tabIndex=event.index;
                        }
                    }}
                    renderTabs={this.renderTabs}
                />
            </PageWithMenu>            
        );
    }
}
