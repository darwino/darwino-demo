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
import { Form, Button, DropdownButton, MenuItem, ProgressBar } from 'react-bootstrap';

import { MainPage } from '@darwino/darwino-react-bootstrap';
import { MicroServices, makeWsUrl } from '@darwino/darwino';
import CodeEditor from '../components/CodeEditor';

class TabScripts extends MainPage {

    constructor(props,context) {
        super(props,context);
        this.onScriptChange = this.onScriptChange.bind(this)
        this.onRun = this.onRun.bind(this)
        this.onStop = this.onStop.bind(this)
        this.onClearConsole = this.onClearConsole.bind(this)
        this.onSelectScript = this.onSelectScript.bind(this)      

        Object.assign(this.state, {
            script:     "",
            console:    "",
            autoClear:  true,
            list:       [],
            progress:   null,
            ws:         null
        })
    }
    
    componentDidMount() {
        super.componentDidMount();

        new MicroServices()
            .name("ListScripts")
            .fetch()
            .then((list) => {
                this.setState({
                    list
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
        const console = this.refs.console;
        if(console) {
            const elt = console;
            const top = elt.getBoundingClientRect().top;
            const height = Math.max( dim.footerTop-top, 250);
            state.consoleHeight = height;
        }
        return state;
    }

    onSelectScript(idx) {
        if(this.state.list) {
            const select = this.state.list[idx];
            //console.log('Selected script: '+select);
            new MicroServices()
                .name("LoadScript")
                .params({name:select})
                .fetch()
                .then((r) => {
                    if(r.script) {
                        this.setState({
                            script: r.script
                        })
                    }
                })
        }
    }

    onScriptChange(script) {
        this.setState({script});
    }

    onRun() {
        const state = this.state;
        this.runScript("script",state.script);
    }

    runScript(command,text) {
        const state = this.state;
        if(!state.ws) {
            const wsUrl = makeWsUrl("/websocket/scripttask");
            const ws = new WebSocket(wsUrl);
            ws.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data);
                const {command} = msg;
                //console.log("Socket message "+command)
                if(command==="error") {
                    this.setState( (state) => {
                        return {console: `${state.console}${msg.text}\n`}
                    });
                } else if(command==="console") {
                    this.setState( (state) => {
                        return {console: `${state.console}${msg.text}`}
                    });
                } else if(command==="progress") {
                    const p = msg.progress;
                    const np = p.complete ? null : p;
                    this.setState( (state) => {
                        return {progress: np}
                    });
                } else {
                    this.setState( (state) => {
                        return {console: `${state.console}\n>>> Unknown server message\n${JSON.stringify(msg)}\n`}
                    });
                }
            });
            ws.addEventListener('open', () => {
                //console.log("Socket open")
                const json = {
                    command,
                    parameters: {
                        text
                    }
                }
                ws.send(JSON.stringify(json));
                if(this.state.autoClear) {
                    this.setState({console:""})   
                }
            });
            ws.addEventListener('close', () => {
                //console.log("Socket close")
                ws.close();
                this.setState({ws:null,progress:null});
            });
            ws.addEventListener('onerror', () => {
                //console.log("Socket onerror")
                ws.close();
                this.setState({ws:null});
            });
            this.setState({ws});
        }
    }

    onStop() {
        const {ws} = this.state;
        if(ws) {
            const command = {
                command: 'stop'
            }
            ws.send(JSON.stringify(command));
        }
    }

    onClearConsole() {
        this.setState( {console: ""} );
    }
    
    render() {
        const state = this.state;
        const progress = state.progress;
        if(state.error) {
            return <div><h4>Error</h4><div>{state.error}</div></div>
        }
        return  <div>
                    <div className="container-fluid" style={{padding:0}}>
                        <div className="row row-no-gutters">
                            <div className="col-sm-12">
                                <h4>Scripts</h4>
                                <Form inline style={{marginBottom: '15px'}}>
                                    <Button type="button" bsStyle="success" style={{marginRight: '1em'}} disabled={!!state.ws} onClick={this.onRun}><span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>Run</Button>
                                    {/*<Button type="button" bsStyle="danger" style={{marginRight: '3em'}} disabled={!state.ws} onClick={this.onStop}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span>Stop</Button>*/}
                                    <DropdownButton
                                        bsStyle="default"
                                        title="Load Script..."
                                        onSelect={this.onSelectScript}
                                    >
                                        {(state.list.map( (script,index) => (
                                            <MenuItem key={index} eventKey={index}>{script}</MenuItem>                                
                                        )))}
                                    </DropdownButton>
                                </Form>
                                <CodeEditor ref="meta" mode="javascript" value={state.script} width='100%' height={"25em"} style={{marginTop:'10px'}} onChange={this.onScriptChange}/>
                                {progress &&(
                                    <div>
                                        <h5>{progress.title}</h5>
                                        <div>{progress.message}</div>
                                        <div>
                                            <button className="stopred" style={{float:'right'}} onClick={this.onStop}></button>
                                            { progress.estimated>0 ? 
                                                 (<ProgressBar now={progress.percent} label={`${progress.percent}%`}/>)
                                                :(<ProgressBar active now={100}/>)
                                            }
                                        </div>
                                        <div>{progress.status}</div>
                                    </div>
                                )}
                                <textarea ref="console" value={state.console} readOnly style={{borderColor: '#E6E6E6', marginTop: '10px', width: '100%', height: (""+(state.consoleHeight||250))+'px'}}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
     }
}

export default TabScripts;