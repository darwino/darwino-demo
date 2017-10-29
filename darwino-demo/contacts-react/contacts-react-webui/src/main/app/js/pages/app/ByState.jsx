/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorGridRowRenderer } from '@darwino/darwino-react'
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";
import {SexFormatter} from "./Formatters";

// Not currently used
class CustomRenderer extends CursorGridRowRenderer {   
}    

// This is used to format a group when it is not displayed as columns
function formatGroup(props) {
    const row = props.row;
    const c = row.__meta.children;
    return props.value + " (" + (c?c.length:0) + ")";
}

// This calculates some totals in order to display them for categories
//   - It sets some group values for displaying in columns when this option is selected
//   - It adds a new row to the children in order to display the totals separately
function calculateTotals(group,groups) {
    if(group.__meta.indentLevel==0) {
        let M = 0, F = 0;
        for(let i=0; i<group.__meta.children.length; i++) {
            let row = group.__meta.children[i];
            let sex = row["Sex"]
            if(sex=='M') M++; else F++;
        }
        // Set the category values to be displayed as columne
        group._M = M
        group._F = F
        group.CommonName = group.key
        group.Sex = M+"M, "+F+"F"
        // Add a new row to the list
        let totals = {
            Sex: group.Sex,
            __meta: {
                totals: true
            }
        }
        group.__meta.children.push(totals)
    } else if(group.__meta.indentLevel==-1) {
        let M = 0, F = 0;
        for(let i=0; i<group.__meta.children.length; i++) {
            let row = group.__meta.children[i];
            M += row._M; F += row._F;
        }
        // Add a new row to the list
        let totals = {
            EMail: "Grand Total:",
            Sex: M+"M, "+F+"F",
            __meta: {
                totals: true
            }
        }
        group.__meta.children.push(totals)
    }
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
                {name: "Name", key: "CommonName", resizable:true},
                {name: "EMail", key: "EMail", resizable:true},
                {name: "Sex", key: "Sex", resizable:true, formatter: SexFormatter, width:100}
            ]
        },
        //renderCategoryAsColumns: true,
        responsive: true,
        processEntries: calculateTotals,
        expandable: "CommonName",
        expandLevel: 1,
        groupBy: [{column: "State", formatter: formatGroup}],
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
