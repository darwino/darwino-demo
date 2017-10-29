/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { Button } from "react-bootstrap";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import RouteForm from "./RouteForm";
import {SexFormatter} from "./Formatters";

import { Link } from "react-router-dom";

//
// Resusable grid component that can be embedded in other pages
// The component carries its own property values and can contribute to the main page
//
export class AllContactsGrid extends CursorGrid {

    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "AllContacts"
        },
        grid: {
            columns:[
                {name: "Name", key: "CommonName", resizable:true, sortable: true, sortField: 'firstname,lastname'},
                {name: "EMail", key: "EMail", resizable:true, sortable: true, sortField: 'email'},
                {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100},
                {name: "State", key: "State", resizable:true, sortable: true, sortField: 'state', width:70}
            ]
        },
        responsive: true,
        baseRoute: "/app/contact",
        dynamicRoute: RouteForm
    }

    export(format) {
        const url = this.createJstoreCursor()
                        .queryParams({format, columns: this.getColumnNames().join(','), titles: this.getColumnTitles().join(',')})
                        .computeUrl('/entries/export')
        window.open(url); 
    }

    contributeActionBar() {
        return (
            <div key="main">
                <Link to={`${this.props.baseRoute}`} className="btn btn-primary">Create New Contact</Link>
                <Button onClick={() => {this.export('csv')}}>Export</Button>
            </div>
        );
    }
}


//
// Main frame that displays the grid in a page, with an action bar
//
export default class AllContacts extends CursorPage {

    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>All Contacts</h4>
                {this.createActionBar()}
                {this.createFTSearchBar()}
                <div>
                    <AllContactsGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
