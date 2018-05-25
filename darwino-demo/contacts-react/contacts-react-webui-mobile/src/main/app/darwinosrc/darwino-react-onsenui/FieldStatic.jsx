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

class FieldStatic extends Component {

    static labelFor(options,value) {
        if(options) {
            for(let i=0; i<options.length; i++) {
                const val = options[i]
                if(typeof(val)==="object" && val.value==value) {
                    return val.label!==undefined ? val.label : val.value
                }
            }
        }
        return value;
    }
    static labelsFor(options,values) {
        return values.map((v) => FieldStatic.labelFor(options,v))
    }
        
    render() {
        const {input, multiple, type, options, editable, separator, disabled, ...props} = this.props;
        const {value} = input
        const inputValue = multiple 
                ? (Array.isArray(value) ? FieldStatic.labelsFor(options,value).join(separator||',') : "") 
                : (value!==undefined && value!==null ? FieldStatic.labelFor(options,value.toString()) : "")
        return (
            <div {...props}>{inputValue}</div>
        )
    }
}
export default FieldStatic
