/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const AllCompaniesByIndustry = () => {
    return (
        <div>
            <h3>All Companies by Industry &amp; State</h3>
            <CursorGrid
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllCompanies"
                }}
                grid={{
                    columns:[
                        {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'},
                        {name: "Name", key: "Name", sortable: true, sortField: 'name'}
                    ]
                }}
                groupBy= {["Industry","State"]}
                baseRoute="/app/company"
            />
        </div>
    )
}

export default AllCompaniesByIndustry