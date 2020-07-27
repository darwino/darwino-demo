/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import FieldCodeEditor from "./FieldCodeEditor"
import {InputBlock} from '@darwino/darwino-react-bootstrap';

const renderCodeEditor = field => {
    const { horizontal, inline, meta, label, ...props} = field;
    return (
        <InputBlock label={label} meta={meta} horizontal={horizontal} inline={inline}>
            <FieldCodeEditor {...props}/>
        </InputBlock>
    )
}
export default renderCodeEditor