/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import CodeEditor from '../components/CodeEditor';

class FieldCodeEditor extends Component {
    render() {
        const { input, disabled, readOnly, meta, ...props} = this.props;        
        return (
            <CodeEditor {...props} {...input} disabled={disabled} readOnly={readOnly}>
            </CodeEditor>
        )
    }
}
export default FieldCodeEditor
