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
