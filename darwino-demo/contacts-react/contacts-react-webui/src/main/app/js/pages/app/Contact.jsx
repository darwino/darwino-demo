/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

import React, { Component } from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, getFormValues, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino-react-bootstrap/form/formControls.jsx";
import DocumentForm from "../../darwino-react-bootstrap/components/DocumentForm.jsx";
import ComputedField from "../../darwino-react-bootstrap/components/ComputedField.jsx";
import { Panel, Tabs, Tab } from 'react-bootstrap';
import Jsql from "../../darwino-react/jstore/jsql";
import { richTextToDisplayFormat, richTextToStorageFormat } from "../../darwino-react/jstore/richtext";

import Constants from "./Constants.jsx";
import CCAddress from "./CCAddress.jsx";

import JsonDebug from "../../darwino-react/util/JsonDebug.jsx";

const DATABASE = Constants.DATABASE;
const STORE = "_default";

const FORM_NAME = "contact";

const US_STATES = Constants.US_STATES;

export class Contact extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        databaseId: DATABASE,
        storeId: STORE,
        nextPageSuccess: "/app/allcontacts"
    };

    constructor(props) {
        super(props)
        this.handleActionClick = this.handleActionClick.bind(this);

        // Get the list of companies
        new Jsql()
            .database(props.databaseId)
            .query("SELECT $.name name FROM companies WHERE $.form='Company' ORDER BY name")
            .format('value')
            .fetch()
            .then((json) => {
                this.setState({allCompanies: json})
            });
    }

    // Default values when a new document is created
    defaultValues() {
        return {
            form: "Contact",
            firstname: "Leonardo",
            lastname: "da Vinci"
        }
    }

    // Validation
    validate(values) {
        const errors = {};
        // Add the validation rules here!
        if(!values.firstname) {
            errors.firstname = "Missing First Name"
        }
        if(!values.lastname) {
            errors.lastname = "Missing Last Name"
        }
        return errors;
    }

    // Values computed once when the document is loaded
    calculateOnLoad(values) {
        return {
            title: "Contact Document"
        }
    }

    // Values computed every time the document is changed
    calculateOnChange(values) {
        return {
            fullname: (values.firstname||'') + " " + (values.lastname||'')
        }
    }

    // Transform the generic attachment links to physical ones
    prepareForDisplay(values) {
        if(values.card) values.card = richTextToDisplayFormat(this.state,values.card)
    }

    // Transform the physical attachment links back to generic ones
    prepareForSave(values) {
        if(values.card) values.card = richTextToStorageFormat(this.state,values.card)
    }
    

    handleActionClick() {
        alert("You clicked me!");
    }

    createActionBar() {
        return (
            <div className="action-bar">
                <button onClick={this.handleActionClick} className="btn btn-default">Click me!</button>
            </div>
        );
    }

    render() {
        const { newDoc, doc } = this.state;
        const { handleSubmit, dirty, reset, invalid, submitting, type } = this.props;
        const disabled = !doc || doc.readOnly;
        return (
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    {this.createActionBar()}
                    <Prompt
                        when={dirty}
                        message={location => (
                            `The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?`
                        )}
                    />                    
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title="Contact Information">
                            <fieldset>
                                <h2>{this.computedValues.title}</h2>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstname" type="text" component={renderField} label="First Name" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="lastname" type="text" component={renderField} label="Last Name" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <ComputedField label="Full Name" value={this.computedValues.fullname}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="email" type="text" component={renderField} label="E-Mail" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="sex" component={renderSelect} label="Sex" disabled={disabled}
                                        options={[
                                            { value: "", label: "- Select One -"},
                                            { value: "M", label: "Male"},
                                            { value: "F", label: "Female"}
                                        ]}
                                    />
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstcontact" component={renderDatePicker} label="Contact Since" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Address">
                                        <CCAddress {...this.props} name="" documentForm={this}/>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Phone Numbers">
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="homephone" type="text" component={renderField} label="Home" disabled={disabled}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="mobilephone" type="text" component={renderField} label="Mobile" disabled={disabled}/>
                                        </div>
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="workphone" type="text" component={renderField} label="Work" disabled={disabled}/>
                                        </div>
                                    </Panel>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="comments" component={renderRichText} label="Comments" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Panel collapsible defaultExpanded header="Company">
                                        <div className="col-md-12 col-sm-12">
                                            <Field name="company" type="text" component={renderSelect} label="Company" disabled={disabled}
                                                options={this.state.allCompanies} emptyOption={true}/>
                                        </div>
                                    </Panel>
                                </div>

                                <div>
                                    <span style={disabled ? {display: 'none'} : {}}>
                                        <div className="pull-right">
                                            <button onClick={this.handleDeleteDocument} className="btn btn-danger" style={newDoc ? {display: 'none'} : {}}>Delete</button>
                                        </div>
                                        <button type="submit" className="btn btn-primary" disabled={invalid||submitting}>Submit</button>
                                    </span>
                                    <a className="btn btn-link" onClick={this.handleCancel}>Cancel</a>
                                </div>
                            </fieldset>
                        </Tab>
                        <Tab eventKey={2} title="Business Card">
                            <fieldset>
                                <div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="card" component={renderRichText} readOnly="true"/>
                                    </div>
                                </div>
                            </fieldset>
                        </Tab>
                    </Tabs>
                    {/*Uncomment to display the current JSON content*/}
                    {/* <JsonDebug form={this.props.form}/>  */}
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
        (form(Contact))
)
