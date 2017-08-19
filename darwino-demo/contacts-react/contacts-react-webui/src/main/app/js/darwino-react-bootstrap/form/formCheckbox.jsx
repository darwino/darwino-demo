/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormGroup, Checkbox, ControlLabel } from 'react-bootstrap';
import { renderText } from "./formText.jsx"

export const renderCheckbox = field => {
    if(field.readOnly) return renderText(field);
    
    const { input, meta, disabled, label } = field;
    return (
        <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
            <label>
                <input type='checkbox' {...input} disabled={disabled} checked={input.value}/>
                {label}
            </label>
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </FormGroup>
    )
};
