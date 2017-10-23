/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { Button } from "react-bootstrap";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";

export class AllCompaniesByIndustryGrid extends CursorGrid {
    
    // Default values of the properties
    static defaultProps  = {
        databaseId:Constants.DATABASE,
        params:{
            name: "AllCompaniesByIndustry"
            //name: "AllCompanies"
        },
        grid: {
            columns:[
                {name: "Industry", key: "Industry", resizable:true, sortable: true, sortField: 'industry'},
                {name: "State", key: "State", resizable:true, sortable: true, sortField: 'state', width:90},
                {name: "Name", key: "Name", resizable:true, sortable: true, sortField: 'name'}
            ]
        },
        baseRoute: "/app/company",
        groupBy: [
            {column:"Industry"}, // formatter: null
            {column:"State"}
        ],
        expandLevel: 2
        //inMemorySort={true}
    }
}        

export default class AllCompaniesByIndustry extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
    }

    contributeActionBar() {
        return (
            <div key="expand">
                <Button onClick={() => {this.getGrid().expandAll()}}>Expand All</Button>
                <Button onClick={() => {this.getGrid().collapseAll()}}>Collapse All</Button>
            </div>
        );
    }
    
    render() {
        return (
            <div>
                <h4>All Companies by Industry &amp; State</h4>
                {this.createActionBar()}
                <div>
                    <AllCompaniesByIndustryGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
