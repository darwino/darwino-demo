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

class FormLayoutHorizontal extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <Form horizontal>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" horizontal component={renderText} label={_t("frmhorz.input","Input Field")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" horizontal component={renderStatic} label={_t("frmhorz.static","Static")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field2" horizontal component={renderValuePicker} label={_t("frmhorz.picker","Value Picker")} disabled={disabled} readOnly={readOnly}
                        picker={(
                            <ListPicker
                                values={[
                                    _t("frmhorz.one","one"), 
                                    _t("frmhorz.two","two"), 
                                    _t("frmhorz.three","three")
                                ]}
                            />
                    )}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field3" horizontal component={renderTextArea} label={_t("frmhorz.textarea","Text Area")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field4" horizontal component={renderSelect} label={_t("frmhorz.select","Select")} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field5" horizontal component={renderDatePicker} label={_t("frmhorz.datpick","Date Picker")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field6" horizontal component={renderCheckbox} label={_t("frmhorz.ckbox","Checkbox")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field7" horizontal component={renderCheckbox} label={_t("frmhorz.ckboxmul","Checkbox Multiple")} multiple disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field8" horizontal component={renderCheckbox} label={_t("frmhorz.ckboxmulin","Checkbox Multiple - inline")} multiple inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field9" horizontal component={renderRadioGroup} label={_t("frmhorz.radio","Radio Buttons")} disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field10" horizontal component={renderRadioGroup} label={_t("frmhorz.radioin","Radio Buttons - inline")} inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field11" horizontal component={renderRichText} label={_t("frmhorz.richtext","Rich Text")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field12" horizontal component={renderAttachments} label={_t("frmhorz.attach","Attachments")} disabled={disabled} readOnly={readOnly}/>
                </div>
            </Form>
        );
    }
}

export default FormLayoutHorizontal