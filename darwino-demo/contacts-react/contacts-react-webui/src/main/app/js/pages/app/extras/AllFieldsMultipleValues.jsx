/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import {  _t } from '@darwino/darwino';
import { renderText, renderCheckbox, renderStatic } from '@darwino/darwino-react-bootstrap';

class AllFieldsMultipleValues extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} label={_t("afmulval.multvalues","Multiple Values")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} separator=";" label={_t("afmulval.multvaluessep","Multiple Values - separator ;")} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderText} editable={true} label={_t("afmulval.multvaluesnosep","Multiple Values - Not editable")} disabled={disabled} readOnly={readOnly}/>
                </div>

                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" component={renderStatic} label={_t("afmulval.statictext","Static Text")} disabled={disabled} readOnly={readOnly}/>
                </div>
            
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} inline={true} component={renderCheckbox} label={_t("afmulval.multck","Multiple Checkboxes")} disabled={disabled} readOnly={readOnly}
                        options={["v1","v2","v3","v4"]}
                    />
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} inline={true} component={renderCheckbox} label={_t("afmulval.multcklbl","Multiple Checkboxes with Labels")} disabled={disabled} readOnly={readOnly}
                        options={[
                            {value:"v1",label:_t("afmulval.value1","Value 1")},
                            {value:"v2",label:_t("afmulval.value2","Value 2")},
                            {value:"v3",label:_t("afmulval.value3","Value 3")},
                            {value:"v4",label:_t("afmulval.value4","Value 4")}
                        ]}
                    />
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="MultipleInput" multiple={true} component={renderCheckbox} label={_t("afmulval.multckvert","Multiple Checkboxes - vertical")} disabled={disabled} readOnly={readOnly}
                        options={[
                            {value:"v1",label:_t("afmulval.value1","Value 1")},
                            {value:"v2",label:_t("afmulval.value2","Value 2")},
                            {value:"v3",label:_t("afmulval.value3","Value 3")},
                            {value:"v4",label:_t("afmulval.value4","Value 4")}
                        ]}
                    />
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsMultipleValues