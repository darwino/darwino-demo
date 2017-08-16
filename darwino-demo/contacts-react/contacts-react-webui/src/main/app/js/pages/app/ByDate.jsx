/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const ByDate = () => {
    return (
        <CursorGrid
            databaseId={Constants.DATABASE}
            params={{
                name: "ByDate"
            }}
            grid={{
                columns:[
                    {name: "Date", key: "Date"},
                    {name: "Name", key: "CommonName"},
                    {name: "EMail", key: "EMail"},
                    {name: "Sex", key: "Sex"},
                    {name: "State", key: "State"}
                ]
            }}
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
        />
    )
}

export default ByDate