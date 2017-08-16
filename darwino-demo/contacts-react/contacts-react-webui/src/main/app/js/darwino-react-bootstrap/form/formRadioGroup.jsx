/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { renderText } from "./formText.jsx"

export const renderRadioGroup = field => {
    if(field.readOnly) return renderText(field);

    const { input, meta, options, disabled, label, inline } = field;
    if(inline) {
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                {label && <ControlLabel>{label}</ControlLabel>}
                <div className="radio">
                    {options && options.map(val => {
                        if(!(typeof(val)==="object")) val = {value:val,label:val};
                        return (
                            <label className="radio-inline" key={val.value}>
                                <input type="radio" {...input} value={val.value} checked={input.value==val.value} disabled={disabled}/>
                                {val.label||val.value}
                            </label>
                        )
                    })}
                </div>
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    } else {
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                {label && <ControlLabel>{label}</ControlLabel>}
                {options && options.map(val => {
                    if(!(typeof(val)==="object")) val = {value:val,label:val};
                    return (
                        <div className="radio">
                            <label key={val.value}>
                                <input type="radio" {...input} value={val.value} checked={input.value==val.value} disabled={disabled}/>
                                {val.label||val.value}
                            </label>
                        </div>
                    )
                })}
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    }
}
