/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const ByState = () => {
    return (
        <CursorGrid
            databaseId={Constants.DATABASE}
            params={{
                name: "ByState"
            }}
            grid={{
                columns:[
                    {name: "State", key: "State", width: 1},
                    {name: "Name", key: "CommonName"},
                    {name: "EMail", key: "EMail"},
                    {name: "Sex", key: "Sex"}
                ],
            }}
            groupBy= {["State"]}
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
        />
    )
}

export default ByState