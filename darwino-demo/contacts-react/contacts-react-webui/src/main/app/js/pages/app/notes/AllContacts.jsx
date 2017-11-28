/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./../Constants.jsx";

import { Link } from "react-router-dom";
import { Nav, NavItem } from 'react-bootstrap';

import { RouteForm, ViewGrid, ViewPage } from '@darwino/darwino-react-bootstrap-notes';


//
// Resusable grid component that can be embedded in other pages
// The component carries its own property values and can contribute to the main page
//
export class AllContactsGrid extends ViewGrid {

    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "AllContacts"
        },
        ftSearch:true,
        grid: {
            columns:[
                {name: "Name", key: "CommonName", resizable:true, sortable: true, sortField: 'firstname,lastname'},
                {name: "EMail", key: "EMail", resizable:true, sortable: true, sortField: 'email'},
                {name: "Sex", key: "Sex", resizable:true, sortable: true, sortField: 'sex'},
                {name: "State", key: "State", resizable:true, sortable: true, sortField: 'state'}
            ]
        },
        baseRoute: "/forms/contact",
        dynamicRoute: RouteForm
    }

    contributeActionBar() {
        return (
            <Nav key="main">
                <NavItem eventKey={1} href="#/forms/contact">Create New Contact</NavItem>
            </Nav>
        );
    }
}
//<Link to={`${this.props.baseRoute}`}>Create New Contact</Link>


//
// Main frame that displays the grid in a page, with an action bar
//
export default class AllContacts extends ViewPage {

    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>All Contacts</h4>
                {this.createActionBar()}
                <AllContactsGrid height={this.state.gridHeight}/>
            </div>
        )
    }
}
