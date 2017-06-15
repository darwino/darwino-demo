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
import CursorGrid from "../../darwino/components/CursorGrid.jsx"

const Contactsg = () => {
    return (
        <CursorGrid
            databaseId="contacts"
            storeId="_default"
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

/*dataLoader = {(num,pagesize) => {
    return new Promise(function(resolve) {
        setTimeout(() => {
            let data = []
            let loaded = num<15 ? pagesize : pagesize/2
            for(let i=0; i<loaded; i++) {
                let idx = num*pagesize+i
                data.push({
                    firstname: 'First'+idx,
                    lastname: 'Last'+idx,
                    adr: {state: 'State'+idx}
                });
            }
            let eof = data.length<pagesize
            let result = {data, eof}
            resolve(result);
        }, 500);
    });
}}*/

export default Contactsg