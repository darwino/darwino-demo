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
import {  _t } from '@darwino/darwino';
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
    return props.value + " (" + (c?c.length-1:0) + ")"; // -1 because of the total row
}

// This calculates some totals in order to display them for categories
//   - It sets some group values for displaying in columns when this option is selected
//   - It adds a new row to the children in order to display the totals separately
function calculateTotals(group,groups) {
    if(group.__meta.indentLevel===0) {
        let M = 0, F = 0;
        for(let i=0; i<group.__meta.children.length; i++) {
            let row = group.__meta.children[i];
            let sex = row["Sex"]
            if(sex==='M') M++; else F++;
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
    } else if(group.__meta.indentLevel===-1) {
        let M = 0, F = 0;
        for(let i=0; i<group.__meta.children.length; i++) {
            let row = group.__meta.children[i];
            M += row._M; F += row._F;
        }
        // Add a new row to the list
        let totals = {
            EMail: _t("bystate.gtotal","Grand Total:"),
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
    static get defaultProps() { 
        return {
            databaseId: Constants.DATABASE,
            params: {
                name: "ByState"
            },
            rowRenderer: CustomRenderer,
            columns:[
                {name: _t("bystate.name","Name"), key: "CommonName", resizable:true},
                {name: _t("bystate.email","EMail"), key: "EMail", resizable:true},
                {name: _t("bystate.sex","Sex"), key: "Sex", resizable:true, formatter: SexFormatter, width:100}
            ],
            //renderCategoryAsColumns: true,
            responsive: true,
            processEntries: calculateTotals,
            expandable: "CommonName",
            expandLevel: 1,
            groupBy: [{column: "State", formatter: formatGroup}],
            baseRoute:"/app/contact"
        }
    }
}

export default class ByState extends CursorPage {
    
    render() {
        return (
            <div>
                <h4>{_t("bystate.title","By State")}</h4>
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
