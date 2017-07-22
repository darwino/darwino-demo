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
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { renderField, renderRadioGroup, renderCheckbox, renderSelect, renderRichText, renderDatePicker } from "../../darwino-react-bootstrap/form/formControls.jsx";
import DocumentForm from "../../darwino-react-bootstrap/components/DocumentForm.jsx";
import Section from "../../darwino-react-bootstrap/components/Section.jsx";
import AttachmentTable from "../../darwino-react-bootstrap/components/AttachmentTable.jsx";

import JsonDebug from "../../darwino-react/util/JsonDebug.jsx";

const DATABASE = Constants.DATABASE;
const STORE = "companies";

const FORM_NAME = "company";

const US_STATES = Constants.US_STATES;

export class Company extends DocumentForm {

    // Default values of the properties
    static defaultProps  = {
        nextPageSuccess: "/app/allcompanies"
    };

    constructor(props) {
        super(props)
        //this.handleActionClick = this.handleActionClick.bind(this);
        this.state = {};
    }

    render() {
        const { handleSubmit, dirty, reset, invalid, submitting, newDoc, doc, type } = this.props;
        const disabled = true;
        
        return (
            <div>
                <form>
                    <fieldset>
                        <legend>Company</legend>

                        <div className="col-md-12 col-sm-12">
                            <Field name="name" type="text" component={renderField} label="Name" disabled={disabled}/>
                        </div>

                        <div className="col-md-12 col-sm-12">
                            <Field name="industry" type="text" component={renderField} label="Industry" disabled={disabled}/>
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

                        <FormGroup>
                            <ControlLabel>Documents</ControlLabel>
                            <AttachmentTable {...this.props} field='documents'/>
                        </FormGroup>

                        <div>
                            <a className="btn btn-link" onClick={this.handleCancel}>Cancel</a>
                        </div>
                        
                        {/*Uncomment to display the current JSON content*/}
                        {/*<JsonDebug form={this.props.form}/>*/}
                    </fieldset>
                </form>
            </div>
        );
  }
}

function validate(values) {
    const errors = {};
    // Add the validation rules here!
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(form(Company)))
