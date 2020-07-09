/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */

 //
 // Custom control example
 // 

import React from "react";
import { Field } from 'redux-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import { DocumentSubform, renderText, renderSelect } from '@darwino/darwino-react-bootstrap';
import Constants from "./Constants";

const US_STATES = Constants.US_STATES;

export default class CCAddress extends DocumentSubform {

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
            errors.street = _t("ccaddress.errstreet","Missing Street")
        }
        if(!values.city) {
            errors.city = _t("ccaddress.errcity","Missing City")
        }
        if(!values.zipcode) {
            errors.zipcode = _t("ccaddress.errzipcode","Missing Zipcode")
        }
        if(!values.state) {
            errors.state = _t("ccaddress.errstate","Missing State")
        }
        return errors;
    }

    contributeActionBar() {
        return (
            <DropdownButton key="address" title={_t("ccaddress.setaddress","Set Address")} id="dropdown-size-medium">
                <MenuItem eventKey="1" onClick={()=>(this.setAddress(1))}>Boston</MenuItem>
                <MenuItem eventKey="2" onClick={()=>(this.setAddress(2))}>New York</MenuItem>
                <MenuItem eventKey="3" onClick={()=>(this.setAddress(3))}>San Francisco</MenuItem>
            </DropdownButton>
        )
    }
        
    setAddress(a) {
        this.setFieldValue("street","");
        switch(a) {
            case 1:
                this.setFieldValue("city","Boston");
                this.setFieldValue("zipcode","02110");
                this.setFieldValue("state","MA");
            break;
            case 2:
                this.setFieldValue("city","New York");
                this.setFieldValue("zipcode","10001");
                this.setFieldValue("state","NY");
            break;
            case 3:
                this.setFieldValue("city","San Francisco");
                this.setFieldValue("zipcode","94016");
                this.setFieldValue("state","CA");
            break;
            default:    
            break;
        }
    }

    render() {
        const readOnly = this.getForm().isReadOnly();
        const disabled = this.getForm().isDisabled();
        return (
            <div>
                <div className="col-md-12 col-sm-12">
                    <Field name="street" type="text" component={renderText} label={_t("ccaddress.street","Street")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="city" type="text" component={renderText} label={_t("ccaddress.city","City")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="zipcode" type="text" component={renderText} label={_t("ccaddress.zipcode","Zip Code")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="state" type="text" component={renderSelect} label={_t("ccaddress.state","State")} disabled={disabled} readOnly={readOnly}
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
