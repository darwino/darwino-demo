/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import Constants from "./Constants.jsx";
import TableCursorList from "../../darwino-react-bootstrap/components/TableCursorList.jsx"

const Contacts = () => {
    return (
        <TableCursorList
            databaseId={Constants.DATABASE}
            storeId={'_default'}
            params={{
                orderby: "firstname,lastname"
            }}
            columns={
                [
                    {title: "FirstName", key: "firstname"},
                    {title: "LastName", key: "lastname"},
                    {title: "State", key: "state"}
                ]
            }
            dataFetcher={{
                pageSize: 50
            }}
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
            addRowsButtonText="Show more rows"
        />
    )
}

export default Contacts