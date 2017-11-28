/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { renderText, renderTextArea, renderStatic, renderDatePicker } from '@darwino/darwino-react-bootstrap';

class AllFieldsText extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label="Simple Input" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label="Simple Input - Read only" readOnly={true} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label="Simple Input - Not editable" editable={false} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderText} label="Simple Input - disabled" disabled={true} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" type="password" component={renderText} label="Simple Input - pasword" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="SimpleInput" component={renderStatic} label="Static Text" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="TextArea" component={renderTextArea} label="Text Area" rows={4} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="DatePicker" component={renderDatePicker} label="Date Picker" disabled={disabled} readOnly={readOnly}/>
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsText