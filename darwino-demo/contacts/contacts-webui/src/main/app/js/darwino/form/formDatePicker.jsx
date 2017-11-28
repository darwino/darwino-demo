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
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker';

export const renderDatePicker = field => {
    return (
    <FormGroup className={field.meta.touched && field.meta.error ? 'has-error' : ''}>
        {field.label && <ControlLabel>{field.label}</ControlLabel>}
        <DatePicker {...field.input}>
            {field.children}
        </DatePicker>
        {field.meta.touched && field.meta.error && <div className="error">{field.meta.error}</div>}
    </FormGroup>
)};
