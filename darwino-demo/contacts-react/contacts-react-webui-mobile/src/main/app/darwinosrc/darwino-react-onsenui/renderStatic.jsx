/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import InputBlock from "./InputBlock"
import FieldStatic from "./FieldStatic"

const renderStatic = (field) => {
    const { horizontal, inline, meta, label, ...props} = field;
    return (
        <InputBlock label={label} meta={meta} horizontal={horizontal} inline={inline}>
            <FieldStatic {...props}/>
        </InputBlock>
    )
};

export default renderStatic