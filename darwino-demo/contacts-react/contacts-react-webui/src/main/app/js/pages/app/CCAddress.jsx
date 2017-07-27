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
