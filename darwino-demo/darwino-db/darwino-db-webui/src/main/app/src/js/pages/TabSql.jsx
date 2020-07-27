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
import ReactDOM from "react-dom";

import { Button,ButtonToolbar } from 'react-bootstrap';
import { CursorPage } from '@darwino/darwino-react-bootstrap';
import { MicroServices } from '@darwino/darwino';
import TreeView, {MicroserviceTree} from '../components/TreeView'

import CodeEditor from '../components/CodeEditor';
import ArrayGrid from '../components/ArrayGrid';


class TabSql extends CursorPage {

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: null,
            sql: "",
            rows: null,
            error: null,
            fetching: false,
            tableColumns: null,
            treeData: undefined
        };

        // SQL Tree
        this.tree = new MicroserviceTree();
        this.onClick = this.onClick.bind(this)

        this.onRun = this.onRun.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSaveAs = this.onSaveAs.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.onSqlChange = this.onSqlChange.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        new MicroServices()
            .name("SqlObjects")
            .fetch()
            .then((r) => {
                this.setState({treeData: r});
                return r;
            })
    }

    resizeElementsTo(dim) {
        const state = super.resizeElementsTo(dim);
        const meta = this.refs.meta;
        if(meta) {
            const metaElt = ReactDOM.findDOMNode(meta);
            const metaTop = metaElt.getBoundingClientRect().top;
            const metaHeight = Math.max( dim.footerTop-metaTop ,250);
            state.metaHeight = metaHeight;
        }
        return state;
    }

    getAceEditor() {
        const editor = this.refs.editor;
        return editor && editor.getAceEditor()
    }

    onClick(node) {
        const aceEditor = this.getAceEditor();
        if(aceEditor) {
            aceEditor.session.replace(aceEditor.selection.getRange(),"");
            const text = aceEditor.session.getValue().trim();
            const id = node.id||"";
            if(id && !text) {
                aceEditor.session.insert(aceEditor.getCursorPosition(), "SELECT * FROM "+id);
            } else {
                aceEditor.session.insert(aceEditor.getCursorPosition(), id);
            }
        }
    }
    
    onRun() {
        const sql = this.state.sql;
        if(sql && sql.trim()) {
            this.setState({
                fetching: true,
                tableColumns: null,
                rows: null
            })
            const maxrows = 500;
            new MicroServices()
                .name("RunSql")
                .params({sql,metadata:true,maxrows})
                .fetch()
                .then((values) => {
                    const tableColumns = [];
                    for(let i=0; i<values.columns.length; i++) {
                        const c = values.columns[i];
                        tableColumns.push({
                            name: c.name, 
                            key: c.name, 
                            resizable: true, 
                            width: (c.size*9+15)
                        });
                    }
                    this.setState({
                        rows: values.rows,
                        error: null,
                        tableColumns,
                        fetching: false
                    })
                }).catch( (error) => {
                    this.setState({
                        rows: null,
                        error: error,
                        tableColumns: null,
                        fetching: false
                    })
            })
        } else {
            this.setState({
                rows: null,
                error: null,
                tableColumns: null,
                fetching: false
            })
        }
    }

    onLoad() {
        // let jsc = new JstoreCursor()
        //     .database(Constants.DATABASE)
        //     .store("_default")
        //     .queryParams({name:"AllCompanies"})
        // return (
        //     <ListPicker
        //         value="Name"
        //         label={(e) => e.Name + " (" + e.State + ")"}
        //         dataLoader={jsc.getDataLoader()}
        //     />
        // )  
    }

    onSave() {
    }

    onSaveAs() {
    }

    onDelete() {
    }

    onSqlChange(sql) {
        this.setState({sql});
    }

    render() {
        const state = this.state;
        return (
            <div>
                {/* <h5>
                    Sql query: <span>{state.name}, </span>
                </h5> */}
                <ButtonToolbar style={{marginBottom: 8, marginTop: 8}}>
                    <Button bsStyle="success" type="button" onClick={this.onRun} style={{marginRight: '18px'}}>Run</Button>
                    {/* <Button bsStyle="primary" type="button" onClick={this.onLoad}>Load...</Button>
                    <Button bsStyle="primary" type="button" onClick={this.onSave}>Save</Button>
                    <Button bsStyle="primary" type="button" onClick={this.onSaveAs}>Save As...</Button>
                    <div className="pull-right">
                        <Button onClick={this.onDelete} disabled={!!this.name} bsStyle="danger">Delete...</Button>
                    </div> */}
                </ButtonToolbar>

                <div className="row">
                    <div className="col-md-9">
                        <CodeEditor ref="editor" mode="javascript" value={state.sql} width='100%' height="8em" onChange={this.onSqlChange} style={{marginBottom: 8}}/>
                        { this.state.error ? this.renderError() : this.renderValues() }
                    </div>
                    <div className="col-md-3">
                        <h5>SQL Objects</h5>
                    { this.state.treeData 
                        ? (<TreeView ref="meta" height={''+this.state.metaHeight+'px'} data={this.state.treeData} tree={this.tree} onClick={this.onClick}/>)
                        : (<div>Loading...</div>)
                    }    
                    </div>
                </div>
            </div>
        );
    }

    renderValues() {
        const state = this.state;
        return (
            <div>
                <ArrayGrid ref="grid"
                    selectRows={false}
                    responsive={true}
                    fetching={state.fetching}
                    height={state.gridHeight}
                    columns={state.tableColumns}
                    rows={state.rows}
                />
            </div>
        );
    }

    renderError() {
        return (
            <div>
                <h4>Error while executing SQL query</h4>
                <pre>
                    <code>
                        {JSON.stringify(this.state.error, null, 2)}
                    </code>
                </pre>
            </div>
        );
    }
}

export default TabSql;