/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
