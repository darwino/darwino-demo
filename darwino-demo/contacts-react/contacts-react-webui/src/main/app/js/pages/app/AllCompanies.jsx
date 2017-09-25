/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { Button } from 'react-bootstrap';

import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import {checkUser} from "./Demo";

class AllCompanies extends CursorPage {

    constructor(props,context) {
        super(props,context)
        this.displaySelection = this.displaySelection.bind(this)
        this.handleDeleteSelectedDocuments = this.handleDeleteSelectedDocuments.bind(this)
    }

    displaySelection() {
        if(this.grid) {
            let sel = ""
            this.grid.getSelectedEntries().forEach( e => {
                sel += "\n" + e.Name
            });
            alert("Selection: "+sel)
        }
    }
    
    handleDeleteSelectedDocuments() {
        if(!checkUser(this)) {
            return;
        }
        if(this.grid) {
            this.grid.handleDeleteSelectedDocuments();
        }
    }

    contributeActionBar() {
        return (
            <div key="main">
                <Button bsStyle="primary" onClick={this.displaySelection}>Display Selection...</Button>
                <div className="pull-right">
                    <Button onClick={this.handleDeleteSelectedDocuments} bsStyle="danger">Delete Selected Companies</Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h4>All Companies</h4>
                {this.createActionBar()}
                {this.createMessages()}
                <CursorGrid
                    height={this.state.gridHeight}
                    ref={(grid) => {this.grid=grid}}
                    databaseId={Constants.DATABASE}
                    params={{
                        name: "AllCompanies"
                    }}
                    selectRows={true}
                    grid={{
                        columns:[
                            {name: "Name", key: "Name", resizable:true, sortable: true, sortField: 'name'},
                            {name: "Industry", key: "Industry", resizable:true, sortable: true, sortField: 'industry'},
                            {name: "State", key: "State", resizable:true, sortable: true, sortField: 'state', width:70}
                        ]
                    }}
                    baseRoute="/app/company"
                />
            </div>
        )
    }
}

export default AllCompanies