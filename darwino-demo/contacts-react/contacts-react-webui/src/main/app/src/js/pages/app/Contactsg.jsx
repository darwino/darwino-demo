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