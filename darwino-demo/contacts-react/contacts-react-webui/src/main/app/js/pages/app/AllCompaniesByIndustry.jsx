/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";

const AllCompaniesByIndustryGrid = (props) => {
    return (
        <div>
            <CursorGrid
                height={props.height}
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllCompanies"
                }}
                grid={{
                    columns:[
                        {name: "Industry", key: "Industry", resizable:true, sortable: true, sortField: 'industry'},
                        {name: "State", key: "State", resizable:true, sortable: true, sortField: 'state', width:70},
                        {name: "Name", key: "Name", resizable:true, sortable: true, sortField: 'name'}
                    ]
                }}
                groupBy= {["Industry","State"]}
                baseRoute="/app/company"
            />
        </div>
    )
}

export default class AllCompaniesByIndustry extends CursorPage {
    
    constructor(props,context) {
        super(props,context)
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
