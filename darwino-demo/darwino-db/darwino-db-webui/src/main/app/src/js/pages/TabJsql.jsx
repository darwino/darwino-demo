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

import {Button,ButtonToolbar} from 'react-bootstrap';
import { MainPage } from '@darwino/darwino-react-bootstrap';
import CodeEditor from '../components/CodeEditor';


class TabJsql extends MainPage {

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: null,
            sql: "",
            values: null,
            error: null,

            tableColumns: null
        };

        this.onRun = this.onRun.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveAs = this.onSaveAs.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onRun() {
    }

    onSave() {
    }

    onSaveAs() {
    }

    onDelete() {
    }

    render() {
        const state = this.state;
        return (
            <div>
                <h5>
                    Sql query: <span>{state.name}, </span>
                </h5>
                <ButtonToolbar>
                    <Button bsStyle="primary" type="button" onClick={this.onRun}>Run</Button>
                    <Button bsStyle="primary" type="button" onClick={this.onSave}>Save</Button>
                    <Button bsStyle="primary" type="button" onClick={this.onSaveAs}>Save As...</Button>
                    <div className="pull-right">
                        <Button onClick={this.onDelete} disabled={!!this.name} bsStyle="danger">Delete Documents...</Button>
                    </div>
                </ButtonToolbar>

                <div>
                    <CodeEditor ref="meta" mode="javascript" value={state.sql} width='100%' height="250px"/>
                    { this.state.values ? this.renderValues() : (this.state.error ? this.renderError() : this.renderEmpty() ) }
                </div>
            </div>
        );
    }


    renderValues() {
        return (
            <div>
                Values...
            </div>
        );
    }
    // renderValues() {
    //     return (
    //         <div>
    //             <CursorGrid ref="grid"
    //                 height={this.state.gridHeight}
    //                 databaseId={this.props.databaseId}
    //                 storeId={this.props.storeId}
    //                 selectRows={true}
    //                 responsive={true}
    //                 params={this.state.params}
    //                 columns={columns}
    //                 onRowDoubleClicked={this.onRowDblClick}
    //             />
    //         </div>
    //     );
    // }

    renderEmpty() {
        return (
            <div>
                <h2>Enter a SQL query</h2>
            </div>
        );
    }

    renderError() {
        return (
            <div>
                <h2>Error while executing SQL query</h2>
                <code>
                    <pre>
                        {JSON.stringify(this.state.error, null, 2)}
                    </pre>
                </code>
            </div>
        );
    }
}

export default TabJsql;