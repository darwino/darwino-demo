/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { Form, Panel, Button, FormControl, FormGroup, ControlLabel, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import {JsonDebug} from "@darwino/darwino-react";
import { CursorGrid, DocumentForm, AttachmentTable,
         renderText, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker, renderAttachments } from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import CCAddress from "./CCAddress";
import {checkUser,isDemoUser} from "./Demo";

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
    static get defaultProps() { 
        return {
            databaseId: DATABASE,
            storeId: STORE,
            savingMessage: true,
            nextPageSuccess: "/app/allcompanies" // Force this view!
        }
    };

    constructor(props,context) {
        super(props,context)
    }

    isReadOnly() {
        // This is for demo purposes, to let the demo user edit the document
        // Although this can be saved
        if(isDemoUser()) {
            return false;
        }
        return super.isReadOnly();
    }

    handleUpdateDocument(state, dispatch) {
        if(!checkUser(this)) {
            return;
        }
        super.handleUpdateDocument(state, dispatch);
    }
    
    render() {
        const { newDoc, doc, mode } = this.state;
        const { handleSubmit, dirty, reset, invalid, submitting, type } = this.props;
        const readOnly = this.isReadOnly();
        const disabled = this.isDisabled();
        
        return (
            <div>
                {this.createMessages()}

                <Form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <div>
                        <span style={(disabled||readOnly) ? {display: 'none'} : {}}>
                            <div className="pull-right">
                                <Button onClick={this.delete} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>Delete</Button>
                            </div>
                            <Button bsStyle="primary" type="submit" disabled={invalid||submitting}>Submit</Button>
                        </span>
                        <Button bsStyle="link" onClick={this.handleCancel}>Cancel</Button>
                    </div>
                    
                    <fieldset>
                        <legend>{_t("company.title","Company")}</legend>

                        <div className="col-md-12 col-sm-12">
                            <Field name="name" type="text" label={_t("company.name","Name")} component={renderText} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="industry" type="text" component={renderText} label={_t("company.industry","Industry")} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="public" component={renderCheckbox} 
                                format={(value) => value==='true'}
                                normalize={(value) => value?'true':''}
                                label={_t("company.ispublic","Is Public")} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="size" component={renderRadioGroup} inline={true} label={_t("company.size","Size")} disabled={disabled} options={SIZES} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Panel collapsible defaultExpanded header={_t("company.address","Address")}>
                                <CCAddress {...this.props} name=""/>
                            </Panel>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="__attachments" type="text" richTextfield='documents' component={renderAttachments} label={_t("company.documents","Documents")} disabled={disabled} readOnly={readOnly}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <FormGroup>
                                <h4>{_t("company.compdoc","Company Documents")}</h4>
                                <CursorGrid
                                    databaseId={Constants.DATABASE}
                                    params={{
                                        name: "AllCompanyDocuments",
                                        parentid: this.state.unid
                                    }}
                                    showResponses={true}
                                    columns={[
                                        {name: _t("company.coltitle","Title"), key: "Title", sortable: true, sortField: 'title'},
                                    ]}
                                />
                            </FormGroup>
                        </div>
                        
                        {/*Uncomment to display the current JSON content*/}
                        {/*<JsonDebug form={this.props.form}/>*/}
                    </fieldset>
                </Form>
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
