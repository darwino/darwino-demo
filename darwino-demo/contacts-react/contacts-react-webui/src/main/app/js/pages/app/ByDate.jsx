/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import {  _t } from '@darwino/darwino';
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
            {name: _t("bydate.date","Date"), key: "Date", resizable:true, formatter: DateFormatter, width:150},
            {name: _t("bydate.name","Name"), key: "CommonName", resizable:true},
            {name: _t("bydate.email","EMail"), key: "EMail", resizable:true},
            {name: _t("bydate.sex","Sex"), key: "Sex", resizable:true, formatter: SexFormatter, width:100},
            {name: _t("bydate.state","State"), key: "State", resizable:true, width:70}
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
                <h4>{_t("bydate.title","By Date")}</h4>
                {this.createActionBar()}
                <div>
                    <ByDateGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
