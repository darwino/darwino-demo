/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { Form } from 'react-bootstrap';
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
                    <Field name="field1" component={renderText} label="Input Field" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field1" component={renderStatic} label="Static" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field2" component={renderValuePicker} label="Value Picker" disabled={disabled} readOnly={readOnly}
                        picker={(
                            <ListPicker
                                values={["one", "two", "three"]}
                            />
                    )}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field3" component={renderTextArea} label="Text Area" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field4" component={renderSelect} label="Select" disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field5" component={renderDatePicker} label="Date Picker" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field6" component={renderCheckbox} label="Checkbox" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field7" component={renderCheckbox} label="Checkbox Multiple" multiple disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field8" component={renderCheckbox} label="Checkbox Multiple - inline" multiple inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field9" component={renderRadioGroup} label="Radio Buttons" disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field10" component={renderRadioGroup} label="Radio Buttons - inline" inline disabled={disabled} readOnly={readOnly} options={["v1","v2"]}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field11" component={renderRichText} label="Rich Text" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="field12" component={renderAttachments} label="Attachments" disabled={disabled} readOnly={readOnly}/>
                </div>
            </Form>
        );
    }
}

export default FormLayoutStacked