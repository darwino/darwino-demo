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
import {SexFormatter} from "./Formatters";

function nameFormatter(props) {
    return _t("byauthors.form","From: ")+props.value
}

export class ByAuthorGrid extends CursorGrid {
    
    // Default values of the properties
    static get defaultProps() { 
        return {
            databaseId: Constants.DATABASE,
            params: {
                name: "ByAuthor"
            },
            columns:[
                {name: _t("byauthors.name","Name"), key: "CommonName", resizable:true },
                {name: _t("byauthors.email","EMail"), key: "EMail", resizable:true},
                {name: _t("byauthors.sex","Sex"), key: "Sex", resizable:true, formatter: SexFormatter, width:100},
                {name: _t("byauthors.state","State"), key: "State", resizable:true, width:70}
            ],
            //renderCategoryAsColumns: true,
            responsive:true,
            expandLevel:1,
            indentDocuments:true,
            expandable: "CommonName",
            groupBy: [{column: "$Creator",formatter:nameFormatter}],
            baseRoute:"/app/contact"
        }
    }
}

export default class ByAuthor extends CursorPage {
    
    render() {
        return (
            <div>
                <h4>{_t("byauthors.byauthor","By Author")}</h4>
                {this.createActionBar()}
                <div>
                    <ByAuthorGrid ref="grid" 
                        height={this.state.gridHeight}/>
                </div>
            </div>
        )
    }
}
