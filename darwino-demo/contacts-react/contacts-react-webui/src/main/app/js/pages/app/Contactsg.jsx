/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";

import {  _t } from '@darwino/darwino';
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
                    {name: _t("contactsg.fname","First Name"), key: "firstname"},
                    {name: _t("contactsg.lname","Last Name"), key: "lastname"},
                    {name: _t("contactsg.state","State"), key: "state"}
                ],
                enableCellSelect: true
            }}
            baseRoute="/app/contact"
        />
    )
}

export default Contactsg