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
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import {  _t } from '@darwino/darwino';
import { renderText, renderSelect } from '@darwino/darwino-react-bootstrap';
import { Subform } from '@darwino/darwino-react-bootstrap-notes';

import Constants from "./../Constants";

const US_STATES = Constants.US_STATES;

export default class CCAddress extends Subform {

    contributeActionBar() {
        return (
            <Nav key="address">
                <NavDropdown eventKey={4} title={_t("notesccaddr.subaction","SubForm Actions")} id="subform-nav-dropdown">
                    <MenuItem eventKey={4.1}>{_t("notesccaddr.action1","Action 1")}</MenuItem>
                    <MenuItem eventKey={4.2}>{_t("notesccaddr.action2","Action 2")}</MenuItem>
                    <MenuItem eventKey={4.3}>{_t("notesccaddr.action3","Action 3")}</MenuItem>
                </NavDropdown>
            </Nav>
        );
    }

    render() {
        const readOnly = this.getForm().isReadOnly();
        const disabled = this.getForm().isDisabled();
        return (
            <div>
                <div className="col-md-12 col-sm-12">
                    <Field name="street" type="text" component={renderText} label={_t("notesccaddr.street","Street")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="city" type="text" component={renderText} label={_t("notesccaddr.city","City")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="zipcode" type="text" component={renderText} label={_t("notesccaddr.zipcode","Zip Code")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-2 col-sm-2">
                    <Field name="state" type="text" component={renderSelect} label={_t("notesccaddr.state","State")} disabled={disabled} readOnly={readOnly}
                            options={US_STATES} emptyOption={true}/>
                </div>
            </div>
        );
    }
}
