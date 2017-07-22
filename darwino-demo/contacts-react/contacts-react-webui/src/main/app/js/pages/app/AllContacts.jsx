/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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
import Constants from "./Constants.jsx";
import RouteForm from "./RouteForm.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

const AllContacts = () => {
    return (
        <div>
            <h3>All Contacts</h3>
            <CursorGrid
                databaseId={Constants.DATABASE}
                params={{
                    name: "AllContacts"
                }}
                ftSearch={true}
                grid={{
                    columns:[
                        {name: "Name", key: "CommonName", sortable: true, sortField: 'firstname,lastname'},
                        {name: "EMail", key: "EMail", sortable: true, sortField: 'email'},
                        {name: "Sex", key: "Sex", sortable: true, sortField: 'sex'},
                        {name: "State", key: "State", sortable: true, sortField: 'state'}
                    ]
                }}
                //baseRoute="/app/contact"
                baseRoute = {RouteForm}
                createButtonText="Create a new contact"
                deleteAllButtonText="Delete all contacts"
            />
        </div>
    )
}

export default AllContacts