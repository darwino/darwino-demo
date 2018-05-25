/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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