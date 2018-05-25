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
import { renderText, renderStatic, renderValuePicker, renderTextArea, renderSelect, renderDatePicker, 
         renderCheckbox, renderRadioGroup, renderAttachments, renderRichText,
         ListPicker } from '@darwino/darwino-react-bootstrap';

class FormLayoutStacked extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <Form>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" component={renderText} label={_t("frmstak.input","Input Field")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" component={renderStatic} label={_t("frmstak.static","Static")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field2" component={renderValuePicker} label={_t("frmstak.valpick","Value Picker")} disabled={disabled} readOnly={readOnly}
                        picker={(
                            <ListPicker
                                values={[
                                    _t("frmstak.one","one"), 
                                    _t("frmstak.two","two"), 
                                    _t("frmstak.three","three")
                                ]}
                            />
                    )}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field3" component={renderTextArea} label={_t("frmstak.textarea","Text Area")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field4" component={renderSelect} label={_t("frmstak.select","Select")} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field5" component={renderDatePicker} label={_t("frmstak.datpick","Date Picker")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field6" component={renderCheckbox} label={_t("frmstak.ckbox","Checkbox")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field7" component={renderCheckbox} label={_t("frmstak.ckboxmul","Checkbox Multiple")} multiple disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field8" component={renderCheckbox} label={_t("frmstak.ckboxmulin","Checkbox Multiple - inline")} multiple inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field9" component={renderRadioGroup} label={_t("frmstak.radio","Radio Buttons")} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field10" component={renderRadioGroup} label={_t("frmstak.radioin","Radio Buttons - inline")} inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field11" component={renderRichText} label={_t("frmstak.richtext","Rich Text")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field12" component={renderAttachments} label={_t("frmstak.attach","Attachments")} disabled={disabled} readOnly={readOnly}/>
                </div>
            </Form>
        );
    }
}

export default FormLayoutStacked