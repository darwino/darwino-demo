/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import {SexFormatter} from "./Formatters";

function nameFormatter(props) {
    return "From: "+props.value
}

export class ByAuthorGrid extends CursorGrid {
    
    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "ByAuthor"
        },
        columns:[
            {name: "Name", key: "CommonName", resizable:true },
            {name: "EMail", key: "EMail", resizable:true},
            {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100},
            {name: "State", key: "State", resizable:true, width:70}
        ],
        //renderCategoryAsColumns: true,
        responsive:true,
        expandLevel:1,
        indentDocuments:true,
        expandable: "CommonName",
        groupBy: [{column: "$Creator",formatter:nameFormatter}],
        baseRoute:"/app/contact"
    }
}

export default class ByAuthor extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>By Author</h4>
                {this.createActionBar()}
                <div>
                    <ByAuthorGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
