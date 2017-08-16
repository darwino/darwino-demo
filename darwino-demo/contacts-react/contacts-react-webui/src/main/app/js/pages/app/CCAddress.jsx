/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 //
 // Custom control example
 // 

import React, { Component } from "react";
import { Field, FormSection } from 'redux-form';
import { renderField, renderSelect } from "../../darwino-react-bootstrap/form/formControls.jsx";
import Constants from "./Constants.jsx";

const US_STATES = Constants.US_STATES;

export default class CCAddress extends FormSection {

    render() {
        const { doc } = this.props;
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
                    <Field name="state" type="text" component={renderSelect} label="State" disabled={disabled} options={US_STATES}/>
                </div>
            </div>
        );
    }
}

CCAddress.formEvents = { 
    initialize: function(values,path,props) {
        values.state = "MA"
    }
}
