/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { renderText } from "./formText.jsx"

export const renderField = field => {
    if(field.readOnly) return renderText(field);
    
    const { input, meta, disabled, label, children, type } = field;
    return (
        <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
            {label && <ControlLabel>{label}</ControlLabel>}
            <FormControl type={type} {...input} disabled={disabled}>
                {children}
            </FormControl>
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </FormGroup>
    )
}
