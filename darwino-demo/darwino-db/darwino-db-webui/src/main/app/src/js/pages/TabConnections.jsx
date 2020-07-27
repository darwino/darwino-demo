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

import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';

import Constants from '../Constants';
import { CursorPage, CursorGrid, DocumentForm, renderText, Dialog  } from '@darwino/darwino-react-bootstrap'

const FORM_NAME = "connectionform";

class _ConnectionsForm extends DocumentForm {

    prepareForDisplay(values) {
        values.__unid = this.state.unid;
    }

    prepareForSave(values) {
    }

    validate(values) {
        const errors = {};
        if(!values.name) {
            errors.name = "Missing Name";
        }
        if(!values.url) {
            errors.url = "Missing URL";
        }
        return errors;
    }

    render() {
        const { handleSubmit } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        return (
            <div>
                {this.createMessages()}
                <Form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <fieldset>
                        <div className="col-md-12 col-sm-12">
                            <Field name="name" type="text" component={renderText} label="Name" disabled={disabled} readOnly={readOnly}/>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Field name="url" type="text" component={renderText} label="URL" disabled={disabled} readOnly={readOnly}/>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Field name="user" type="text" component={renderText} label="User" disabled={disabled} readOnly={readOnly}/>
                        </div>
                        <div className="col-md-12 col-sm-12">
                            <Field name="password" type="password" component={renderText} label="Password" disabled={disabled} readOnly={readOnly}/>
                        </div>
                    </fieldset>
                </Form>
            </div>
        )
    }
}   

const cform = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});
const ConnectionsForm = (
    connect(null,DocumentForm.mapDispatchToProps)
        (cform(_ConnectionsForm))
)



class TabConnections extends CursorPage {

    static get defaultProps() { 
        return {
            databaseId: Constants.DATABASE,
            storeId: "connections",
            params:{
                name: "AllConnections"
            },
            columns:[
                {name: "Name", key: "name", resizable:true, sortable: true, sortField: 'name'},
                {name: "URL", key: "url", resizable:true, sortable: true, sortField: 'url'},
                {name: "User", key: "user", resizable:true, sortable: true, sortField: 'user'}
            ],
            responsive: true,
            form: (props) => {return (<ConnectionsForm {...props}/>)}
            //baseRoute: "/app/company",
            // groupBy: [
            //     {column:"Industry"}, // formatter: null
            //     {column:"State"}
            // ],
            // expandLevel: 2
            //inMemorySort={true}
        }
    }

    constructor(props,context) {
        super(props,context)
        this.onSearch = this.onSearch.bind(this);
        this.onRowDblClick = this.onRowDblClick.bind(this);
        this.onNewDocument = this.onNewDocument.bind(this);
        this.onDeleteDocuments = this.onDeleteDocuments.bind(this)
    }

    contributeActionBar() {
        return (
            <div key="main">
                <Button bsStyle="primary" onClick={this.onNewDocument}>{"New Connection"}</Button>
                <div className="pull-right">
                    <Button onClick={this.onDeleteDocuments} bsStyle="danger">{"Delete"}</Button>
                </div>
            </div>
        );
    }

    onSearch(params) {
        //this.setState({params})
    }

    openDocumentDialog(props) {
        const form = this.props.form;
        if(form) {
            const dialog = this.getDialog();
            const formProps = {
                databaseId: this.props.databaseId,
                storeId:    props.storeId || this.props.storeId,
                unid:       props.unid || this.props.unid,
                onGotoNextPage: () => {
                    dialog.hide(Dialog.OK)
                }
            }
            dialog.form({
                title:props.title,
                form: form(formProps),
                onAction: (action) => {
                    if(action===Dialog.OK) {
                        // Submit the form
                        const e = dialog.getDomElement();
                        if(e) {
                            const coll = e.getElementsByTagName('form');
                            if(coll && coll.length>0) {
                                const f = coll.item(0);
                                f.requestSubmit();
                            }
                        }
                    }
                },
                onHide: (action) => {
                    // Can we just refresh one row?
                    if(action===Dialog.OK) {
                        this.getGrid().reinitData();
                    }
                    return true;
                }
            })
        }
    }

    onNewDocument(e) {
        this.openDocumentDialog({
            title: "New Connection"
        });
    }

    onRowDblClick(e) {
        const { unid, storeId } = e.__meta;
        this.openDocumentDialog({
            title: "Edit Connection",
            storeId,
            unid
        });
    }

    onDeleteDocuments() {
        if(this.getGrid()) {
            const p = this.getGrid().handleDeleteSelectedDocuments();
            p && p.then(this.getGrid().reinitData());
        }
    }
    
    render() {
        const props = this.props;
        return (
            <div>
                <h4>"Server Connections"</h4>
                {this.createActionBar()}
                {this.createMessages()}
                <CursorGrid ref="grid" 
                    height={this.state.gridHeight}
                    databaseId={props.databaseId}
                    storeId={props.storeId}
                    params={props.params}
                    selectRows={true}
                    responsive={true}
                    onRowDoubleClicked={this.onRowDblClick}
                    columns={props.columns}
                />
            </div>
        )
    }
}

export default TabConnections