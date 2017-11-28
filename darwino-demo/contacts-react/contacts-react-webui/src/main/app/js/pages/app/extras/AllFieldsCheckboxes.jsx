/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { renderCheckbox } from '@darwino/darwino-react-bootstrap';

class AllFieldsCheckboxes extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="CheckboxDefault" component={renderCheckbox} label="Default Checkbox" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="CheckboxBoolean" component={renderCheckbox} label="Boolean Checkbox" checkedValue={true} uncheckedValue={false} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="CheckboxString" component={renderCheckbox} label="String Checkbox" checkedValue={"CheckedValue"} uncheckedValue={"UncheckedValue"} disabled={disabled} readOnly={readOnly}/>
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsCheckboxes