/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, {Component} from "react";
import PropTypes from 'prop-types';
import {
    Page,
    List,
    ListTitle,
    ListItem,
    Icon,
    Toolbar
} from 'react-onsenui';
import {Hybrid} from "@darwino/darwino";

class Menu extends Component {

    // We make the navigator globally available, similarly to react-navigator
    static childContextTypes = {
        layout: PropTypes.object
    };
    getChildContext() {
        return {layout: this};
    }

    // Context to read from the parent - navigator
    constructor(props,context) {
        super(props,context)
    }

    hideMenu() {
        if(this.context.layout) {
            this.context.layout.showLeftMenu(false);
        }
    }

    navigate(route) {
        if(this.props.navigator) {
            // Not sure why the following functions don't work
            // We should use them to not grow the stack indefinitely...
            //this.props.navigator.resetPage({page:"views",props:{tabIndex}});
            //this.props.navigator.replacePage({page:"views",props:{tabIndex}});
            this.props.navigator.pushPage(route);
            this.hideMenu();
        }
    }

    renderHybrid() {
        return (
            <div>
                <ListTitle>Data Synchronization</ListTitle>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.switchToRemote(); this.hideMenu()}}>
                    <div className="center">Work With Remote Data</div>
                    {Hybrid.getMode()==0 && <div className="right"><Icon icon="fa-check" style={{color: 'grey'}}/></div>}
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.switchToLocal(); this.hideMenu()}}>
                    <div className="center">Work With Local Data</div>
                    {Hybrid.getMode()==1 && <div className="right"><Icon icon="fa-check" style={{color: 'grey'}}/></div>}
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.synchronizeData(); this.hideMenu()}}>
                    <div className="center">Synchronize Data Now</div>
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.eraseLocalData(); this.hideMenu()}}>
                    <div className="center">Erase Local Data</div>
                </ListItem>
                <ListTitle>Settings</ListTitle>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.refreshData(); this.hideMenu()}}>
                    <div className="center">Refresh Page</div>
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => {Hybrid.openSettings(); this.hideMenu()}}>
                    <div className="center">Settings...</div>
                </ListItem>
            </div>
        );
    }

    render() {
        return (
            <Page>
                <ListTitle>Pages</ListTitle>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => this.navigate({page:"views",props:{tabIndex:0}})}>
                    <div className="center">Contacts</div>
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} onClick={() => this.navigate({page:"views",props:{tabIndex:1}})}>
                    <div className="center">Companies</div>
                </ListItem>
                {Hybrid.isHybrid() && this.renderHybrid()}
                <ListTitle>Links</ListTitle>
                <ListItem tappable style={{cursor: 'pointer'}} modifier="longdivider chevron" onClick={() => window.open('https://www.darwino.com')}>
                    <div className="left"><Icon icon="fa-external-link" style={{color: 'grey'}}/></div>
                    <div className="center">Darwino</div>
                </ListItem>
                <ListItem tappable style={{cursor: 'pointer'}} modifier="longdivider chevron" onClick={() => window.open('https://github.com/darwino')}>
                    <div className="left"><Icon icon="fa-external-link" style={{color: 'grey'}}/></div>
                    <div className="center">Github repo</div>
                </ListItem>
            </Page>
        );
    }
}

export default Menu;
