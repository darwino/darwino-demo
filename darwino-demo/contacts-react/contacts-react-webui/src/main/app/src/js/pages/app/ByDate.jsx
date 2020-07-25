/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2020.
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
import {  _t } from '@darwino/darwino';
import { CursorPage, CursorGrid} from '@darwino/darwino-react-bootstrap'
import Constants from "./Constants";

import {DateFormatter,SexFormatter} from "./Formatters";


export class ByDateGrid extends CursorGrid {
    
    // Default values of the properties
    static get defaultProps() { 
        return {
            databaseId: Constants.DATABASE,
            params: {
                name: "ByDate"
            },
            columns:[
                {name: _t("bydate.date","Date"), key: "Date", resizable:true, formatter: DateFormatter, width:150},
                {name: _t("bydate.name","Name"), key: "CommonName", resizable:true},
                {name: _t("bydate.email","EMail"), key: "EMail", resizable:true},
                {name: _t("bydate.sex","Sex"), key: "Sex", resizable:true, formatter: SexFormatter, width:100},
                {name: _t("bydate.state","State"), key: "State", resizable:true, width:70}
            ],
            responsive:true,
            baseRoute:"/app/contact"
        }
    }
}

export default class ByDate extends CursorPage {
    
    render() {
        return (
            <div>
                <h4>{_t("bydate.title","By Date")}</h4>
                {this.createActionBar()}
                <div>
                    <ByDateGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
