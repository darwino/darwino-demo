/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const Contactsg = () => {
    return (
        <CursorGrid
            databaseId={Constants.DATABASE}
            storeId={'_default'}
            params={{
                orderby: "firstname,lastname"
            }}
            grid={{
                columns:[
                    {name: "FirstName", key: "firstname"},
                    {name: "LastName", key: "lastname"},
                    {name: "State", key: "state"}
                ],
                enableCellSelect: true
            }}
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
        />
    )
}

export default Contactsg