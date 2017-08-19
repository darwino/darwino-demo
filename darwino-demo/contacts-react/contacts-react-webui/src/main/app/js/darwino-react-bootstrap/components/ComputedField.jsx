/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, { Component } from "react";

/*
 * ComputedField
 */
import { FormGroup, ControlLabel } from 'react-bootstrap';

export class ComputedField extends Component {

    render() {
        const {label, value} = this.props
        return (
            <FormGroup>
                {label && <ControlLabel>{label}</ControlLabel>}
                <p className="form-control-static">{value!=null && value.toString()}</p>
            </FormGroup>
        )
    }
}

export default ComputedField
