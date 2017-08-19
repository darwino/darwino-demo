/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

export const renderText = field => {
    const {label, input } = field;
    return (
        <FormGroup>
            {label && <ControlLabel>{label}</ControlLabel>}
            <p className="form-control-static">{input.value}</p>
        </FormGroup>
    )
};
