/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React, { Component } from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Link, Prompt } from "react-router-dom";
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino/form/formControls.jsx";
import DocumentForm from "../../darwino/components/DocumentForm.jsx";
import Section from "../../darwino/components/Section.jsx";

import JsonDebug from "../../darwino/util/JsonDebug.jsx";

const FORM_NAME = "contact";
const DATABASE = "contacts";
const STORE = "_default";

const US_STATES = [{"label":"Alabama","value":"AL"},{"label":"Alaska","value":"AK"},{"label":"American Samoa","value":"AS"},{"label":"Arizona","value":"AZ"},{"label":"Arkansas","value":"AR"},{"label":"California","value":"CA"},{"label":"Colorado","value":"CO"},{"label":"Connecticut","value":"CT"},{"label":"Delaware","value":"DE"},{"label":"District Of Columbia","value":"DC"},{"label":"Federated States Of Micronesia","value":"FM"},{"label":"Florida","value":"FL"},{"label":"Georgia","value":"GA"},{"label":"Guam","value":"GU"},{"label":"Hawaii","value":"HI"},{"label":"Idaho","value":"ID"},{"label":"Illinois","value":"IL"},{"label":"Indiana","value":"IN"},{"label":"Iowa","value":"IA"},{"label":"Kansas","value":"KS"},{"label":"Kentucky","value":"KY"},{"label":"Louisiana","value":"LA"},{"label":"Maine","value":"ME"},{"label":"Marshall Islands","value":"MH"},{"label":"Maryland","value":"MD"},{"label":"Massachusetts","value":"MA"},{"label":"Michigan","value":"MI"},{"label":"Minnesota","value":"MN"},{"label":"Mississippi","value":"MS"},{"label":"Missouri","value":"MO"},{"label":"Montana","value":"MT"},{"label":"Nebraska","value":"NE"},{"label":"Nevada","value":"NV"},{"label":"New Hampshire","value":"NH"},{"label":"New Jersey","value":"NJ"},{"label":"New Mexico","value":"NM"},{"label":"New York","value":"NY"},{"label":"North Carolina","value":"NC"},{"label":"North Dakota","value":"ND"},{"label":"Northern Mariana Islands","value":"MP"},{"label":"Ohio","value":"OH"},{"label":"Oklahoma","value":"OK"},{"label":"Oregon","value":"OR"},{"label":"Palau","value":"PW"},{"label":"Pennsylvania","value":"PA"},{"label":"Puerto Rico","value":"PR"},{"label":"Rhode Island","value":"RI"},{"label":"South Carolina","value":"SC"},{"label":"South Dakota","value":"SD"},{"label":"Tennessee","value":"TN"},{"label":"Texas","value":"TX"},{"label":"Utah","value":"UT"},{"label":"Vermont","value":"VT"},{"label":"Virgin Islands","value":"VI"},{"label":"Virginia","value":"VA"},{"label":"Washington","value":"WA"},{"label":"West Virginia","value":"WV"},{"label":"Wisconsin","value":"WI"},{"label":"Wyoming","value":"WY"}];

export class Source extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        nextPageSuccess: "/app/contacts"
    };

    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        const { handleSubmit, dirty, reset, invalid, submitting, newDoc, doc, type } = this.props;
        const disabled = !doc || doc.readOnly;
        
        return (
            <div>
                <form onSubmit={handleSubmit(this.handleUpdateDocument)}>
                    <Prompt
                        when={dirty||newDoc}
                        message={location => (
                            `The contact is modified and not saved yet.\nDo you want to leave the current page without saving it?`
                        )}
                    />                    
                    <fieldset>
                        <legend>Contacts</legend>

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
                            <Link to={this.props.nextPageSuccess} className="btn btn-link">Cancel</Link>
                        </div>
                        
                        <JsonDebug form={this.props.form}/>
                    </fieldset>
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
