/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";

import {CursorGrid} from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants.jsx";

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
        />
    )
}

export default Contactsg