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
        function onChange(content,delta,source,editor) { 
            if(source!=="api") {
                input.onChange(content)
            }
        }
        // This generates an issue where the content gets empty when there is a click on a combobox within the toolbar */}                    
        // We only pass 'value' & 'onchange'                     
        //    onBlur={input.onBlur}
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                {label && <ControlLabel>{label}</ControlLabel>}
                <ReactQuill
                    theme='snow'
                    readOnly={disabled}
                    onChange={onChange}
                    value={input.value}
                    modules={_quillModules}>
                </ReactQuill>
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    }
}

