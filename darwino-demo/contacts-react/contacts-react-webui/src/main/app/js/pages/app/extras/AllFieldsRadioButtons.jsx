/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";

import { Field } from 'redux-form';
import { renderRadioGroup } from '@darwino/darwino-react-bootstrap';

const SIZES = [
    '0',
    '1',
    '2',
    '3'
];

const SIZESLABEL = [
    {value:'0',label:'0-9'},
    {value:'1',label:'10-499'},
    {value:'2',label:'500-9999'},
    {value:'3',label:'10000+'}
];

class AllFieldsRadioButtons extends Component {

    render() {
        const {mainForm} = this.props;
        const readOnly = mainForm.isReadOnly();
        const disabled = mainForm.isDisabled();
        return (
            <fieldset>
                <div className="col-md-12 col-sm-12">
                    <Field name="Size" component={renderRadioGroup} inline={true} label="Size" options={SIZES} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="Size" component={renderRadioGroup} inline={true} label="Size with label" options={SIZESLABEL} disabled={disabled} readOnly={readOnly}/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <Field name="Size" component={renderRadioGroup} label="Size with label - not inline" options={SIZESLABEL} disabled={disabled} readOnly={readOnly}/>
                </div>
            </fieldset>
        );
    }
}

export default AllFieldsRadioButtons