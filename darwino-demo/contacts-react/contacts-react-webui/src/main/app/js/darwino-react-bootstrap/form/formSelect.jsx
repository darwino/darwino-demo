/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { renderText } from "./formText.jsx"

export const renderSelect = field => {
    if(field.readOnly) return renderText(field);
    
    const { input, meta, disabled, label, type, emptyOption, options } = field;
    
    return (
        <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
            {label && <ControlLabel>{label}</ControlLabel>}
            <FormControl componentClass="select" type={type} {...input} disabled={disabled}>
                { emptyOption && <option key='' value=''>{emptyOption}</option> }
                { options && options.map(val => {
                    if(!(typeof(val)==="object")) val = {value:val,label:val};
                    return (
                        <option key={val.value} value={val.value}>{val.label||val.value}</option>
                    )
                })}
            </FormControl>
            {meta.touched && meta.error && <div className="error">{meta.error}</div>}
        </FormGroup>
    )
}
