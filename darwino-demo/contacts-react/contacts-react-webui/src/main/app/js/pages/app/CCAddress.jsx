/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 //
 // Custom control example
 // 

import React, { Component } from "react";
import { Field } from 'redux-form';
import { renderField, renderSelect } from "../../darwino-react-bootstrap/form/formControls.jsx";
import Constants from "./Constants.jsx";
import DocumentSubform from "../../darwino-react-bootstrap/components/DocumentSubform.jsx";

const US_STATES = Constants.US_STATES;

export default class CCAddress extends DocumentSubform {

    constructor(props,context) {
        super(props,context)
    }

    defaultValues() {
        return {
            city: "Boston",
            zipcode: "02110",
            state: "MA"
        }
    }

    validate(values) {
        const errors = {};
        // Add the validation rules here!
        if(!values.street) {
            errors.street = "Missing Street"
        }
        if(!values.city) {
            errors.city = "Missing City"
        }
        if(!values.zipcode) {
            errors.zipcode = "Missing Zipcode"
        }
        if(!values.state) {
            errors.state = "Missing State"
        }
        return errors;
    }

    render() {
        const { doc } = this.props.documentForm.state;
        const disabled = !doc || doc.readOnly;
        return (
            <div>
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
                    <Field name="state" type="text" component={renderSelect} label="State" disabled={disabled} 
                            options={US_STATES} emptyOption={true}/>
                </div>
            </div>
        );
    }
}
