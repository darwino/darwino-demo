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
import React, {Component} from "react";

import { Field } from 'redux-form';
import { Form } from 'react-bootstrap';
import {  _t } from '@darwino/darwino';
import { FieldText, FieldStatic, FieldValuePicker, FieldTextArea, FieldSelect, FieldDatePicker, 
         FieldCheckbox, FieldRadioGroup, FieldRichText, FieldAttachments, 
         ListPicker } from '@darwino/darwino-react-bootstrap';

class FormLayoutComponents extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <Form>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" component={FieldText} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" component={FieldStatic} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field2" component={FieldValuePicker} disabled={disabled} readOnly={readOnly}
                        picker={(
                            <ListPicker
                                values={[
                                    _t("frmlaycomp.one","one"), 
                                    _t("frmlaycomp.two","two"), 
                                    _t("frmlaycomp.three","three")
                                ]}
                            />
                    )}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field3" component={FieldTextArea} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field4" component={FieldSelect} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field5" component={FieldDatePicker} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field6" component={FieldCheckbox} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field7" component={FieldCheckbox} multiple disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field8" component={FieldCheckbox} multiple inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field9" component={FieldRadioGroup} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field10" component={FieldRadioGroup} inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field11" component={FieldRichText} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field12" component={FieldAttachments} disabled={disabled} readOnly={readOnly}/>
                </div>
            </Form>
        );
    }
}

export default FormLayoutComponents