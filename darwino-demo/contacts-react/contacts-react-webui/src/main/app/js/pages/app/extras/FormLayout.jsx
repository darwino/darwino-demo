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
import React from "react";
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { Tabs, Tab, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

import {  _t } from '@darwino/darwino';
import { DocumentForm } from '@darwino/darwino-react-bootstrap';

import Constants from "../Constants";
import FormLayoutStacked from "./FormLayoutStacked";
import FormLayoutHorizontal from "./FormLayoutHorizontal";
import FormLayoutComponents from "./FormLayoutComponents";

const {DEFAULT_MODE,EDITABLE,DISABLED,READONLY} = DocumentForm
const FORM_NAME = "formlayout";

//
// Demo page showing the different field editor
//
class FormLayout extends DocumentForm {

    constructor(props,context) {
        super(props,context)
    }

    defaultValues(values) {
        values.MultipleInput = ["v1","v2"]
    }

    render() {
        return (
            <div>
                <h2>Form Layout</h2>

                <div className="col-md-12 col-sm-12">
                    <ToggleButtonGroup type="radio" name="mode" value={this.getMode()} onChange={(value)=>(this.setMode(value))}>
                        <ToggleButton value={EDITABLE}>{_t("frmlay.editable","Editable")}</ToggleButton>                            
                        <ToggleButton value={DISABLED}>{_t("frmlay.disable","Disabled")}</ToggleButton>                            
                        <ToggleButton value={READONLY}>{_t("frmlay.readonly","Readonly")}</ToggleButton>                            
                    </ToggleButtonGroup>
                </div>

                <Tabs defaultActiveKey={1} id="doctab">
                    <Tab eventKey={1} title={_t("frmlay.staklbl","Stacked Labels")}>
                        <FormLayoutStacked mainForm={this}/>
                    </Tab>
                    <Tab eventKey={2} title={_t("frmlay.horzlbl","Horizontal Labels")}>
                        <FormLayoutHorizontal mainForm={this}/>
                    </Tab>
                    <Tab eventKey={3} title={_t("frmlay.nolbl","Components (no labels)")}>
                        <FormLayoutComponents mainForm={this}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});

export default withRouter(
    connect(null,DocumentForm.mapDispatchToProps)
        (form(FormLayout))
)
