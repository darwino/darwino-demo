/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { renderText, renderCheckbox, renderStatic } from '@darwino/darwino-react-bootstrap';

class AllFieldsMultipleValues extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} label="Multiple Values" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} separator=";" label="Multiple Values - separator ;" disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} editable={true} label="Multiple Values - Not editable" disabled={disabled} readOnly={readOnly}/>
                </div>

                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" component={renderStatic} label="Static Text" disabled={disabled} readOnly={readOnly}/>
                </div>
            
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} inline={true} component={renderCheckbox} label="Multiple Checkboxes" disabled={disabled} readOnly={readOnly}
                        options={["v1","v2","v3","v4"]}
                    />
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} inline={true} component={renderCheckbox} label="Multiple Checkboxes with Labels" disabled={disabled} readOnly={readOnly}
                        options={[
                            {value:"v1",label:"Value 1"},
                            {value:"v2",label:"Value 2"},
                            {value:"v3",label:"Value 3"},
                            {value:"v4",label:"Value 4"}
                        ]}
                    />
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderCheckbox} label="Multiple Checkboxes - vertical" disabled={disabled} readOnly={readOnly}
                        options={[
                            {value:"v1",label:"Value 1"},
                            {value:"v2",label:"Value 2"},
                            {value:"v3",label:"Value 3"},
                            {value:"v4",label:"Value 4"}
                        ]}
                    />
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsMultipleValues