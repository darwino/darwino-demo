/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import FieldStatic from './FieldStatic';
import {
    Input
} from 'react-onsenui';

class FieldText extends Component {
    render() {
        const { input, multiple, type, editable, separator, disabled, readOnly, ...props} = this.props;
        if(readOnly) return (<FieldStatic {...this.props}/>);
        
        let inputType = type;
        const inputReadOnly = editable!==undefined && editable

        let inputAttr = input;
        if(multiple) {
            inputAttr = {
                value: Array.isArray(input.value) ? input.value.join(separator||',') : "",
                onBlur: (e) => {
                    const a = (e.target.value || "").split(separator||',')
                    input.onBlur(a)
                },
                onChange: (e) => {
                    const a = (e.target.value || "").split(separator||',')
                    input.onChange(a)
                }
            }
            inputType = "text"
        }
        // OnsenUI Bug: https://github.com/OnsenUI/OnsenUI/issues/2323
        // readOnly={inputReadOnly}
        let ro = {}
        if(inputReadOnly) ro.readOnly = true
        return (
            <Input type={type} {...props} {...inputAttr} disabled={disabled} {...ro}>
            </Input>
        )
    }
}
export default FieldText
//<Input type={type} {...props} {...inputAttr} disabled={disabled} readOnly={inputReadOnly}>
