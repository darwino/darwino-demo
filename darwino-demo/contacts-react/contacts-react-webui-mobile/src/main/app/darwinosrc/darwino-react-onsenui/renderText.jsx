/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import InputBlock from "./InputBlock"
import FieldText from "./FieldText"
import renderStatic from "./renderStatic"

const renderText = field => {
    const { horizontal, inline, meta, label, ...props} = field;
    return (
        <InputBlock label={label} meta={meta} horizontal={horizontal} inline={inline}>
            <FieldText {...props}/>
        </InputBlock>
    )
}
export default renderText
