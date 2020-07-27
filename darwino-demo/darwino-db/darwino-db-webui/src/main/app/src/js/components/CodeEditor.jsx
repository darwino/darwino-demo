/**
 * Dynamic Tab Component
 * 
 * Inspired, but largely modified, from (license MIT)
 *     https://github.com/freeranger/react-bootstrap-tabs
 * or
 *     https://github.com/darwino/react-bootstrap-tabs
 */

import React    from 'react';

// https://www.npmjs.com/package/react-ace
// https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-properties";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-github";

let ace_id = 1;

class CodeEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: "ACE_EDITOR_"+(ace_id++),
        }
    }

    getEditor() {
        return this.refs.editor;
    }

    getAceEditor() {
        const editor = this.refs.editor;
        return editor && editor.editor;
    }

    render() {
        // On Blur leads to a problem here... The editor gets corrupted
        const {mode,theme,showPrintMargin,value,onChange,onBlur,...extraProps} = this.props;
        return (
            <AceEditor
                ref="editor"
                mode={mode || "javascript"}
                theme={theme || "github"}
                showPrintMargin={showPrintMargin || false}
                name={this.state.id}
                editorProps={{ $blockScrolling: true }}
                value={value}
                onChange={onChange}
                {...extraProps}
            />
        );  
    }
};

export default CodeEditor;
