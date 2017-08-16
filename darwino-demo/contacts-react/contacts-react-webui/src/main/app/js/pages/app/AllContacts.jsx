/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import RouteForm from "./RouteForm.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const AllContacts = () => {
    return (
        <div>
            <h3>All Contacts</h3>
            <CursorGrid
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllContacts"
                }}
                ftSearch={true}
                grid={{
                    columns:[
                        {name: "Name", key: "CommonName", sortable: true, sortField: 'firstname,lastname'},
                        {name: "EMail", key: "EMail", sortable: true, sortField: 'email'},
                        {name: "Sex", key: "Sex", sortable: true, sortField: 'sex'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'}
                    ]
                }}
                baseRoute="/app/contact"
                dynamicRoute = {RouteForm}
                createButtonText="Create a new contact"
                deleteAllButtonText="Delete all contacts"
            />
        </div>
    )
}

export default AllContacts