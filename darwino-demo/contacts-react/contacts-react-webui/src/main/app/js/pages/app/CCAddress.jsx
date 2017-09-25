/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 //
 // Custom control example
 // 

import React, { Component } from "react";
import { Field } from 'redux-form';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';

import { DocumentSubform, renderText, renderSelect } from '@darwino/darwino-react-bootstrap';
import Constants from "./Constants.jsx";

const US_STATES = Constants.US_STATES;

export default class CCAddress extends DocumentSubform {

    constructor(props,context) {
        super(props,context)
    }

    defaultValues(values) {
        Object.assign(values, {
            city: "Boston",
            zipcode: "02110",
            state: "MA"
        })
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

    contributeActionBar() {
        return (
            <DropdownButton key="address" title="Set Address" id="dropdown-size-medium">
                <MenuItem eventKey="1" onClick={()=>(this.setAddress(1))}>Boston</MenuItem>
                <MenuItem eventKey="2" onClick={()=>(this.setAddress(2))}>New York</MenuItem>
                <MenuItem eventKey="3" onClick={()=>(this.setAddress(3))}>San Francisco</MenuItem>
            </DropdownButton>
        )
    }
        
    setAddress(a) {
        this.setFieldValue("street","");
        switch(a) {
            case 1: {
                this.setFieldValue("city","Boston");
                this.setFieldValue("zipcode","02110");
                this.setFieldValue("state","MA");
            } break;
            case 2: {
                this.setFieldValue("city","New York");
                this.setFieldValue("zipcode","10001");
                this.setFieldValue("state","NY");
            } break;
            case 3: {
                this.setFieldValue("city","San Francisco");
                this.setFieldValue("zipcode","94016");
                this.setFieldValue("state","CA");
            } break;
        }
    }

    render() {
        const readOnly = this.getForm().isReadOnly();
        const disabled = this.getForm().isDisabled();
        return (
            <div>
                <div className="col-md-12 col-sm-12">
                    <Field name="street" type="text" component={renderText} label="Street" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="city" type="text" component={renderText} label="City" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="zipcode" type="text" component={renderText} label="Zip Code" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="state" type="text" component={renderSelect} label="State" disabled={disabled} readOnly={readOnly}
                            options={US_STATES} emptyOption={true}/>
                </div>
                {!readOnly && !disabled && (
                    <div className="col-md-12 col-sm-12">
                        <div className="btn-group">
                            <button type="button" className="btn btn-default" onClick={()=>(this.setAddress(1))}>Boston</button>
                            <button type="button" className="btn btn-default" onClick={()=>(this.setAddress(2))}>New York</button>
                            <button type="button" className="btn btn-default" onClick={()=>(this.setAddress(3))}>San Franciso</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
