/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { renderText, renderTextArea, renderStatic, renderDatePicker, ComputedField } from '@darwino/darwino-react-bootstrap';

class AllFieldsComputed extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="Value1" component={renderText} label="Value 1" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="Value2" component={renderText} label="Value 1"  disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ComputedField name="CalculatedValue" label="Computed Value"/>
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsComputed