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
import React from "react";
import { Button } from "react-bootstrap";
import {  _t } from '@darwino/darwino';
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
    static get defaultProps() { 
        return {
            databaseId: Constants.DATABASE,
            params: {
                name: "AllContacts"
            },
            columns:[
                {name: _t("allcontacts.name","Name"), key: "CommonName", resizable:true, sortable: true, sortField: 'firstname,lastname'},
                {name: _t("allcontacts.email","EMail"), key: "EMail", resizable:true, sortable: true, sortField: 'email'},
                {name: _t("allcontacts.sex","Sex"), key: "Sex", resizable:true, formatter: SexFormatter, width:100},
                {name: _t("allcontacts.state","State"), key: "State", resizable:true, sortable: true, sortField: 'state', width:70}
            ],
            responsive: true,
            baseRoute: "/app/contact",
            dynamicRoute: RouteForm
        }
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
                <Link to={`${this.props.baseRoute}`} className="btn btn-primary">{_t("allcontacts.new","Create New Contact")}</Link>
                <Button onClick={() => {this.export('csv')}}>{_t("allcontacts.export","Export")}</Button>
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
                <h4>{_t("allcontacts.title","All Contacts")}</h4>
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
