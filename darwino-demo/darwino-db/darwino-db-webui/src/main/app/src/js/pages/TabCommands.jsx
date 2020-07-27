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
import { Form, FormControl, Button, ButtonToolbar, DropdownButton, MenuItem, ProgressBar } from 'react-bootstrap';

import { MainPage } from '@darwino/darwino-react-bootstrap';
import { makeWsUrl } from '@darwino/darwino';

const COMMAND_KEY = "DwoCommands";

class TabCommands extends MainPage {

    constructor(props,context) {
        super(props,context);
        this.onCommandChange = this.onCommandChange.bind(this)
        this.onRun = this.onRun.bind(this)
        this.onCommandKeyPress = this.onCommandKeyPress.bind(this)
        this.onStop = this.onStop.bind(this)
        this.onClearConsole = this.onClearConsole.bind(this)
        this.onSelectCommand = this.onSelectCommand.bind(this)    

        const savedCommands = localStorage.getItem(COMMAND_KEY);

        Object.assign(this.state, {
            script:     "",
            command:    "",
            commands:   savedCommands ? JSON.parse(savedCommands) : [],
            console:    "",
            autoClear:  true,
            list:       [],
            progress:   null,
            ws:         null
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

    onSelectCommand(idx) {
        if(this.state.commands) {
            const command = this.state.commands[idx];
            this.setState({command})
            if(this.refs.command) {
                const elt = ReactDOM.findDOMNode(this.refs.command);
                elt.focus();
            }        
        }
    }

    onCommandChange(e) {
        this.setState({command:e.target.value});
    }

    onCommandKeyPress(e) {
        if(e.charCode===13) {
            e.preventDefault();
            this.onRun();
        }
    }

    onRun() {
        const state = this.state;
        if(this.refs.command) {
            const elt = ReactDOM.findDOMNode(this.refs.command);
            elt.select();
            elt.focus();
        }
        this.runScript("cli",state.command);
        const commands = state.commands;
        for(let i=0; i<commands.length; i++) {
            if(i>=15 || commands[i]===state.command) {
                commands.splice(i,1);
            }
        }
        commands.unshift(state.command)
        this.setState({commands})
        localStorage.setItem(COMMAND_KEY,JSON.stringify(commands));
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
                                <h4>Console</h4>
                                <Form>
                                    <ButtonToolbar style={{marginBottom: 8, marginTop: 8}}>
                                        <Button type="button" bsStyle="success" style={{marginRight: '1em'}} disabled={!!state.ws} onClick={this.onRun}><span className="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>Run</Button>
                                        <DropdownButton bsStyle="default" onSelect={this.onSelectCommand} title="History">
                                            {(state.commands.map( (command,index) => (
                                                <MenuItem key={index} eventKey={index}>{command.substring(0,80)}</MenuItem>                                
                                            )))}
                                        </DropdownButton>
                                    </ButtonToolbar>
                                    <FormControl ref="command" type="text" placeholder="Enter Command or 'help'..." value={state.command} onChange={this.onCommandChange} onKeyPress={this.onCommandKeyPress}/>
                                </Form>
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

export default TabCommands;