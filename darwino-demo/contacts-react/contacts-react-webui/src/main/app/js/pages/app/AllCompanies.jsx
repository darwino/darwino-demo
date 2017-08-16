/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const AllCompanies = () => {
    return (
        <div>
            <h3>All Companies</h3>
            <CursorGrid
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllCompanies"
                }}
                grid={{
                    columns:[
                        {name: "Name", key: "Name", sortable: true, sortField: 'name'},
                        {name: "Industry", key: "Industry", sortable: true, sortField: 'industry'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'}
                    ]
                }}
                baseRoute="/app/company"
            />
        </div>
    )
}

export default AllCompanies