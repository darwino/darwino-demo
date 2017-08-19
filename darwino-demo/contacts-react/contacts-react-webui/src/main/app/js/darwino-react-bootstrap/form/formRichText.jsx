/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import { FormGroup, ControlLabel } from 'react-bootstrap';
import ReactQuill from "react-quill";

// CSS
import 'react-quill/dist/quill.snow.css';

const _quillModules= {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large'] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'align': [] }],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
    ]
}

let preventOnChange = false;
class ReactQuillFix extends ReactQuill {
	componentWillReceiveProps(nextProps, nextState) {
        preventOnChange = true;
        try {
            super.componentWillReceiveProps(nextProps, nextState)
        } finally {
            preventOnChange = false;
        }
    }
}

export const renderRichText = field => {
    const { input, meta, disabled, label } = field;
    if(field.readOnly) {
        return (
            <FormGroup>
                {label && <ControlLabel>{label}</ControlLabel>}
                <div dangerouslySetInnerHTML={{__html: input.value}}></div>
            </FormGroup>
        )
    } else {
        // React-quill issue that sets the form dirty when the value is set
        // See: https://github.com/zenoamaro/react-quill/issues/259
        let input2 = {
            ...input,
            onChange: function(content,delta,source,editor) { 
                if(!preventOnChange) input.onChange(content)
            }
        }
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                {label && <ControlLabel>{label}</ControlLabel>}
                <ReactQuillFix 
                    theme='snow'
                    readOnly={disabled}
                    {...input2} 
                    modules={_quillModules}>
                </ReactQuillFix>
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    }
}
