/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import React, { Component } from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino-react-bootstrap/form/formControls.jsx";
import DocumentForm from "../../darwino-react-bootstrap/components/DocumentForm.jsx";
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
        nextPageSuccess: "/app/allcontacts"
    };

    constructor(props) {
        super(props)
        this.handleActionClick = this.handleActionClick.bind(this);
        this.state = {};

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
        const { handleSubmit, dirty, reset, invalid, submitting, newDoc, doc, type } = this.props;
        const disabled = !doc || doc.readOnly;
        const title = "phil"
        return (
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    {this.createActionBar()}
                    <Prompt
                        when={dirty||newDoc}
                        message={location => (
                            `The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?`
                        )}
                    />                    
                    <Tabs defaultActiveKey={1}>
                        <Tab eventKey={1} title="Contact Information">
                            <fieldset>
                                <h2>{title}</h2>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstname" type="text" component={renderField} label="First Name" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="lastname" type="text" component={renderField} label="Last Name" disabled={disabled}/>
                                </div>

                                <div>
                                    {this.props.computed.fullName}
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
                                        <CCAddress {...this.props}/>
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
                                                options={this.state.allCompanies}/>
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
                                
                                {/*Uncomment to display the current JSON content*/}
                                {/*<JsonDebug form={this.props.form}/>*/}
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
                </form>
            </div>
        );
  }
}

Contact.formEvents = { 
    delegates: [CCAddress],
    validate: function(values,props) {
        const errors = {};
        // Add the validation rules here!
        if(!values.firstname) {
            errors.firstname = "Missing First Name"
        }
        if(!values.lastname) {
            errors.lastname = "Missing Last Name"
        }
        return errors;
    },
    initialize: function(values,props) {
        Object.assign(values, {
            form: "Contact",
            firstname: "Leonardo",
            lastname: "da Vinci"
        })
    },
    prepareForDisplay: function(values,props) {
        // Transform the generic attachment links to physical ones
        if(values.card) values.card = richTextToDisplayFormat(props,values.card)
    },
    prepareForSave: function(values,props) {
        // Transform the physical attachment links back to generic ones
        if(values.card) values.card = richTextToStorageFormat(props,values.card)
    }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm(Contact),
    enableReinitialize: true
});

function computedFields(f) {
    return function(state,ownProps)  {
        let r = f(state,ownProps)
        r.computed = {
            fullName: "Full NAME"
        }
        return r;
    }
}

export default withRouter(
    connect(computedFields(DocumentForm.mapStateToProps(Contact, DATABASE, STORE)),DocumentForm.mapDispatchToProps())
        (form(Contact))
)
