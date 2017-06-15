/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import React from "react";
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
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
    const { input, meta, options, label } = field;

    if(field.disabled) {
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                <ControlLabel>{label}</ControlLabel>
                <div dangerouslySetInnerHTML={{__html: input.value}}></div>
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    } else {
        return (
            <FormGroup className={meta.touched && meta.error ? 'has-error' : ''}>
                <ControlLabel>{label}</ControlLabel>
                <ReactQuill 
                    theme='snow'
                    {...field.input} 
                    modules={_quillModules}>
                </ReactQuill>
                {meta.touched && meta.error && <div className="error">{meta.error}</div>}
            </FormGroup>
        )
    }
}