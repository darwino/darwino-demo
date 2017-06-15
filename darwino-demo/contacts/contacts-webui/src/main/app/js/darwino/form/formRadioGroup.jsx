/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React from "react";
import { FormGroup, ControlLabel } from 'react-bootstrap';

export const renderRadioGroup = field => {
    const { input, meta, options, label } = field;

    return (
    <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
        <ControlLabel>{label}</ControlLabel>
        <div className="form-control">
            {options.map(val => 
                <label className="radio-inline" key={val.value}>
                    <label><input type="radio" {...input} value={val.value} checked={input.value==val.value} disabled={field.disabled}/> {val.label}</label>
                </label>
            )}
        </div>
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FormGroup>
)};
