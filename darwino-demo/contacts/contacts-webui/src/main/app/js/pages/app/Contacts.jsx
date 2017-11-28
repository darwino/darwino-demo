/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React from "react";
import TableCursorList from "../../darwino/components/TableCursorList.jsx"

const Contacts = () => {
    return (
        <TableCursorList
            databaseId="contacts"
            storeId="_default"
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
            baseRoute="/app/contact"
            createButtonText="Create a new contact"
            deleteAllButtonText="Delete all contacts"
            addRowsButtonText="Show more rows"
        />
    )
}

export default Contacts