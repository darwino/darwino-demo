/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";

import {DateFormatter,SexFormatter} from "./Formatters";


export class ByDateGrid extends CursorGrid {
    
    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "ByDate"
        },
        columns:[
            {name: "Date", key: "Date", resizable:true, formatter: DateFormatter, width:150},
            {name: "Name", key: "CommonName", resizable:true},
            {name: "EMail", key: "EMail", resizable:true},
            {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100},
            {name: "State", key: "State", resizable:true, width:70}
        ],
        responsive:true,
        baseRoute:"/app/contact"
    }
}

export default class ByDate extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>By Date</h4>
                {this.createActionBar()}
                <div>
                    <ByDateGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
