/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2020.
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
import React from "react";
import { Button } from "react-bootstrap";
import {  _t } from '@darwino/darwino';
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";

export class AllCompaniesByIndustryGrid extends CursorGrid {
    
    // Default values of the properties
    static get defaultProps() { 
        return {
            databaseId:Constants.DATABASE,
            params:{
                name: "AllCompaniesByIndustry"
                //name: "AllCompanies"
            },
            columns:[
                {name: _t("allcompindus.industry","Industry"), key: "Industry", resizable:true, sortable: true, sortField: 'industry'},
                {name: _t("allcompindus.state","State"), key: "State", resizable:true, sortable: true, sortField: 'state', width:90},
                {name: _t("allcompindus.name","Name"), key: "Name", resizable:true, sortable: true, sortField: 'name'}
            ],
            responsive: true,
            baseRoute: "/app/company",
            groupBy: [
                {column:"Industry"}, // formatter: null
                {column:"State"}
            ],
            expandLevel: 2
            //inMemorySort={true}
        }
    }
}        

export default class AllCompaniesByIndustry extends CursorPage {


    contributeActionBar() {
        return (
            <div key="expand">
                <Button onClick={() => {this.getGrid().expandAll()}}>{_t("allcompindus.expall","Expand All")}</Button>
                <Button onClick={() => {this.getGrid().collapseAll()}}>{_t("allcompindus.colall","Collapse All")}</Button>
            </div>
        );
    }
    
    render() {
        return (
            <div>
                <h4>{_t("allcompindus.title","All Companies by Industry and State")}</h4>
                {this.createActionBar()}
                <div>
                    <AllCompaniesByIndustryGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
