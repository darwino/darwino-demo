/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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