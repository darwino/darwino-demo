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
import Constants from "./Constants.jsx";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino-react-bootstrap/form/formControls.jsx";
import DocumentForm from "../../darwino-react-bootstrap/components/DocumentForm.jsx";
import Section from "../../darwino-react-bootstrap/components/Section.jsx";
import { Tabs, Tab } from "../../darwino-react-bootstrap/components/Tabs.jsx";
import { richTextToDisplayFormat } from "../../darwino-react/jstore/richtext";

import JsonDebug from "../../darwino-react/util/JsonDebug.jsx";

const DATABASE = Constants.DATABASE;
const STORE = "contacts";

const FORM_NAME = "contact";

const US_STATES = Constants.US_STATES;

export class Source extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        nextPageSuccess: "/app/allcontacts"
    };

    constructor(props) {
        super(props)
        this.handleActionClick = this.handleActionClick.bind(this);
        this.state = {};
    }

    handleActionClick() {
        alert("You clicked me!");
    }

    componentWillReceiveProps(nextProps) {
        const {doc} = nextProps;
        //richTextToDisplayFormat(db, store, instance, unid, html) 
        if(doc) {
            doc.json.card = richTextToDisplayFormat(nextProps,doc.json.card)
        }
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
                    <Tabs>
                        <Tab label="Contact Information">
                            <fieldset>
                                <div className="col-md-12 col-sm-12">
                                    <Field name="firstname" type="text" component={renderField} label="First Name" disabled={disabled}/>
                                </div>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="lastname" type="text" component={renderField} label="Last Name" disabled={disabled}/>
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

                                <Section defaultExpanded={true} title="Address" className="col-md-12 col-sm-12">
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="street" type="text" component={renderField} label="Street" disabled={disabled}/>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="city" type="text" component={renderField} label="City" disabled={disabled}/>
                                    </div>
                                    <div className="col-md-2 col-sm-2">
                                        <Field name="zipcode" type="text" component={renderField} label="Zip Code" disabled={disabled}/>
                                    </div>
                                    <div className="col-md-2 col-sm-2">
                                        <Field name="state" type="text" component={renderSelect} label="State" disabled={disabled} options={US_STATES}/>
                                    </div>
                                </Section>

                                <Section defaultExpanded={true} title="Phone Numbers" className="col-md-12 col-sm-12">
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="home" type="text" component={renderField} label="Home" disabled={disabled}/>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="mobile" type="text" component={renderField} label="Mobile" disabled={disabled}/>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <Field name="work" type="text" component={renderField} label="Work" disabled={disabled}/>
                                    </div>
                                </Section>

                                <div className="col-md-12 col-sm-12">
                                    <Field name="comments" component={renderRichText} label="Comments" disabled={disabled}/>
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
                        <Tab label="Business Card">
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

function validate(values) {
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

const selector = formValueSelector(FORM_NAME)
function mapStateToProps(state, ownProps) {
    return DocumentForm.mapStateToProps(state, ownProps, DATABASE, STORE)
}
const mapDispatchToProps = DocumentForm.mapDispatchToProps;

const form = reduxForm({
    form: FORM_NAME,
    validate,
    enableReinitialize: true
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(form(Source)))
