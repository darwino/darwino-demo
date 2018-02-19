/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React from "react";
import {  _t } from '@darwino/darwino';
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
                    {title: _t("contacts.fname","First Name"), key: "firstname"},
                    {title: _t("contacts.lname","Last Name"), key: "lastname"},
                    {title: _t("contacts.title","State"), key: "state"}
                ]
            }
            dataFetcher={{
                pageSize: 50
            }}
            baseRoute="/app/contact"
            addRowsButtonText={_t("contacts.morerows","Show more rows")}
        />
    )
}

export default Contacts