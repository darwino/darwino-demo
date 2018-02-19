/* 
 * (c) Copyright Darwino Inc. 2014-2017.
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
    
    constructor(props,context) {
        super(props,context)
    }

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
