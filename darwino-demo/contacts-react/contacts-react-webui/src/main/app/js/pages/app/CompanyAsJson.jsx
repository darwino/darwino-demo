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
import { DocumentForm, AttachmentTable,
         renderTextArea } from '@darwino/darwino-react-bootstrap'

import Constants from "./Constants";
import {checkUser,isDemoUser} from "./Demo";

const DATABASE = Constants.DATABASE;
const STORE = "companies";

const FORM_NAME = "companyAsJson";

export class CompanyAsJson extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        databaseId: DATABASE,
        storeId: STORE,
        savingMessage: true,
        nextPageSuccess: "/app/allcompaniesasjson" // Force this view!
    };

    constructor(props,context) {
        super(props,context)
    }

    // Convert the whole document content as a 'json' property into the document
    // This property must be the only one to be edited going forward
    prepareForDisplay(values) {
        const json = JSON.stringify(values,null," ");
        values.json = json;
    }

    // Read back the JSON property as text and set its content to the values parameters
    // 'values' is a temporary object that will be saved to the database
    prepareForSave(values) {
        const json = values.json ? JSON.parse(values.json) : {}
        for (var p in values) if (values.hasOwnProperty(p)) delete values[p];
        Object.assign(values,json)
    }

    validate(values) {
        const errors = {};
        const json = values.json;
        if(json) {
            try {
                JSON.parse(json);
            } catch (e) {
                errors.json = _t("companyjson.invjson","Invalid JSON value")
            }
        }
        return errors;
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
                                <Button onClick={this.delete} bsStyle="danger" style={newDoc ? {display: 'none'} : {}}>{_t("companyjson.delete","Delete")}</Button>
                            </div>
                            <Button bsStyle="primary" type="submit" disabled={invalid||submitting}>{_t("companyjson.submit","Submit")}</Button>
                        </span>
                        <Button bsStyle="link" onClick={this.handleCancel}>{_t("companyjson.cancel","Cancel")}</Button>
                    </div>
                    
                    <fieldset>
                        <legend>{_t("companyjson.title","Company As JSON")}</legend>

                        <div className="col-md-12 col-sm-12">
                            <Field name="json" type="text" label={_t("companyjson.json","JSON")} rows={15} component={renderTextArea} disabled={disabled} readOnly={readOnly}/>
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
        (form(CompanyAsJson))
)
