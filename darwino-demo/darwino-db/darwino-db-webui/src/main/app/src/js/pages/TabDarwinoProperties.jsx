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
import React from "react";
import ReactDOM from "react-dom";

import { MainPage } from '@darwino/darwino-react-bootstrap';
import { MicroServices } from '@darwino/darwino';
import CodeEditor from '../components/CodeEditor';


class TabDarwinoBeans extends MainPage {

    componentDidMount() {
        super.componentDidMount();
        new MicroServices()
            .name("ReadDarwinoProperties")
            .fetch()
            .then((doc) => {
                this.setState({
                    doc
                })
            })
            .catch((e) => {
                this.setState({
                    error: JSON.stringify(e,null,"  ")
                })
            })
    }

    isAutoResizeElements() {
        return true;
    }

    resizeElementsTo(dim) {
        const state = super.resizeElementsTo(dim);
        const meta = this.refs.meta;
        if(meta) {
            const metaElt = ReactDOM.findDOMNode(meta);
            const metaTop = metaElt.getBoundingClientRect().top;
            const metaHeight = Math.max( dim.footerTop-metaTop, 250);
            state.metaHeight = metaHeight;
        }
        return state;
    }
    
    render() {
        if(this.state.error) {
            return <div><h4>Error</h4><div>{this.state.error}</div></div>
        }
        const loc = this.state.doc ? this.state.doc.location : "";
        const text = this.state.doc ? this.state.doc.content : "";
        return  <div>
                    <h4>Darwino Properties</h4>
                    <br/>
                        <div>This file is read only. You can update it on the host machine.</div>
                        <div>Location: <code>{loc}</code></div>
                    <br/>
                    <CodeEditor ref="meta" mode="properties" readOnly={true} value={text} width='100%' height={""+(this.state.metaHeight||250)+"px"}/>
                </div>
     }
}

export default TabDarwinoBeans;