/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorGridRowRenderer } from '@darwino/darwino-react'
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";
import {SexFormatter} from "./Formatters";

class CustomRenderer extends CursorGridRowRenderer {   
    formatGroup(value) {
        const props = this.props;
        const row = props.row;
        const c = row.__meta.children;
        return value + " (" + (c?c.length:0) + ")";
    }
}    

function calculateTotals(group) {
    let M = 0, F = 0;
    for(let i=0; i<group.__meta.children.length; i++) {
        let row = group.__meta.children[i];
        let sex = row["Sex"]
        if(sex=='M') M++; else F++;
    }
    let totals = {
        Sex: M+"M, "+F+"F",
        __meta: {
            totals: true
        }
    }
    group.__meta.children.push(totals)
}
    
export class ByStateGrid extends CursorGrid {
    
    // Default values of the properties
    static defaultProps  = {
        databaseId: Constants.DATABASE,
        params: {
            name: "ByState"
        },
        rowRenderer: CustomRenderer,
        grid: {
            columns:[
                // This column is not needed...
                //{name: "State", key: "State", resizable:true, width: 1},
                {name: "Name", key: "CommonName", resizable:true},
                {name: "EMail", key: "EMail", resizable:true},
                {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100}
            ]
        },
        calculateTotals,
        expandable: "CommonName",
        expandLevel: 1,
        groupBy: [{column: "State"}],
        baseRoute:"/app/contact"
    }
}

export default class ByState extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
    }
    
    render() {
        return (
            <div>
                <h4>By State</h4>
                {this.createActionBar()}
                {this.createFTSearchBar()}
                <div>
                    <ByStateGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
