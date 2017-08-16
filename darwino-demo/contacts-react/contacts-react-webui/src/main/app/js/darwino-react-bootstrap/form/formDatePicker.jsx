/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormGroup, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';
import { renderText } from "./formText.jsx"

export const renderDatePicker = field => {
    if(field.readOnly) return renderText(field);
    
    const { input, meta, disabled, label, children } = field;
    return (
        <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
            {label && <ControlLabel>{label}</ControlLabel>}
            <DatePicker {...input}>
                {children}
            </DatePicker>
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </FormGroup>
    )
}
