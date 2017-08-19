/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import Constants from "./Constants.jsx";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { FormControl, FormGroup, ControlLabel, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino-react-bootstrap/form/formControls.jsx";
import DocumentForm from "../../darwino-react-bootstrap/components/DocumentForm.jsx";
import { Panel } from 'react-bootstrap';
import AttachmentTable from "../../darwino-react-bootstrap/components/AttachmentTable.jsx";
import JsonDebug from "../../darwino-react/util/JsonDebug.jsx";
import CursorGrid from "../../darwino-react-bootstrap/components/CursorGrid.jsx"

import CCAddress from "./CCAddress.jsx";

const DATABASE = Constants.DATABASE;
const STORE = "companies";

const FORM_NAME = "company";

const US_STATES = Constants.US_STATES;
const SIZES = [
    {value:'0',label:'0-9'},
    {value:'1',label:'10-499'},
    {value:'2',label:'500-9999'},
    {value:'3',label:'10000+'},
];

export class Company extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        databaseId: DATABASE,
        storeId: STORE,
        nextPageSuccess: "/app/allcompanies"
    };

    constructor(props) {
        super(props)
        //this.handleActionClick = this.handleActionClick.bind(this);
        this.state.mode = {
            // 0: readonly, 1: disabled, 2:edit
            mode: 2
        };
    }

    render() {
        const { newDoc, doc, mode } = this.state;
        const { handleSubmit, dirty, reset, invalid, submitting, type } = this.props;
        const readOnly = mode==0;
        const disabled = mode==1;
        
        return (
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <fieldset>
                        <legend>Company</legend>

                        <div className="col-md-12 col-sm-12">
                            <Field name="name" type="text" component={renderField} label="Name" disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="industry" type="text" component={renderField} label="Industry" disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="public" component={renderCheckbox} 
                                format={(value) => value==='true'}
                                normalize={(value) => value?'true':''}
                                label="Is Public" disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="size" component={renderRadioGroup} inline={true} label="Size" disabled={disabled} options={SIZES} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Panel collapsible defaultExpanded header="Address">
                                <CCAddress {...this.props} documentForm={this}/>
                            </Panel>
                        </div>

                        <FormGroup>
                            <ControlLabel>Documents</ControlLabel>
                            <AttachmentTable {...this.props} field='documents'/>
                        </FormGroup>

                        <div>
                            <span style={(disabled||readOnly) ? {display: 'none'} : {}}>
                                <div className="pull-right">
                                    <button onClick={this.handleDeleteDocument} className="btn btn-danger" style={newDoc ? {display: 'none'} : {}}>Delete</button>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={invalid||submitting}>Submit</button>
                            </span>
                            <a className="btn btn-link" onClick={this.handleCancel}>Cancel</a>
                        </div>

                        <div>
                            <h3>Company Documents</h3>
                            <CursorGrid
                                databaseId={Constants.DATABASE}
                                params={{
                                    name: "AllCompanyDocuments",
                                    parentid: this.props.unid,
                                    jsontree: true
                                }}
                                showResponses={true}
                                grid={{
                                    columns:[
                                        {name: "Title", key: "Title", sortable: true, sortField: 'title'},
                                    ]
                                }}
                            />
                        </div>
                        
                        {/*Uncomment to display the current JSON content*/}
                        {/*<JsonDebug form={this.props.form}/>*/}
                    </fieldset>
                </form>
            </div>
        );
  }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});

export default withRouter(
    connect(null,DocumentForm.mapDispatchToProps)
        (form(Company))
)
