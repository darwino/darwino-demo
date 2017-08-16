/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import Constants from "./Constants.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const ByAuthor = () => {
    return (
        <CursorGrid
            databaseId={Constants.DATABASE}
            params={{
                name: "ByAuthor"
            }}
            grid={{
                columns:[
                    {name: "Author", key: "$Creator", width: 1},
                    {name: "Name", key: "CommonName"},
                    {name: "EMail", key: "EMail"},
                    {name: "Sex", key: "Sex"},
                    {name: "State", key: "State"}
                ]
            }}
            groupBy= {["$Creator"]}
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
        />
    )
}

export default ByAuthor