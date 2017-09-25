/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import {TableCursorList} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants.jsx";

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
            addRowsButtonText="Show more rows"
        />
    )
}

export default Contacts