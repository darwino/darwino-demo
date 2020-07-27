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
import { ProgressBar } from 'react-bootstrap';

import { MainPage } from '@darwino/darwino-react-bootstrap';
import { notificationCenter } from './NotificationCenter';


class TabTasks extends MainPage {

    constructor(props,context) {
        super(props,context)
        this.state = Object.assign( this.state, {
            tasks: []
        })
    }

    componentDidMount() {
        super.componentDidMount();
        this.socketListener = {
            "onOpen": () => {
                notificationCenter.sendCommand("listtasks");
            },
            "onCommand": (command,msg) => { 
                if(command==="tasklist") {
                    this.setState( () => {
                        return {tasks:msg.tasks}
                    });
                } else if(command==="progress") {
                    const progress = msg.progress;
                    const idx = this.findTask(progress.taskId);
                    if(idx>=0) {
                        this.setState( (state) => {
                            state.tasks[idx] = progress
                            return {tasks: state.tasks}
                        });
                    } else {
                        console.log(`Unknown task with id ${progress.taskId}`)
                    }
                }
            }
        }
        notificationCenter.addListener(this.socketListener);
    }

    componentWillUnmount() {
        notificationCenter.removeListener(this.socketListener);
        this.socketListener = null;
        super.componentWillUnmount();
    }

    findTask(taskId) {
        return this.state.tasks.findIndex( (task) => {
            return task.taskId===taskId;
        });
    }

    onStop(taskId) {
        notificationCenter.sendCommand("stop",{taskId});
    }

    render() {
        const state = this.state;
        if(state.error) {
            return <div><h4>Error</h4><div>{state.error}</div></div>
        }
        return  (
            <div>
                {state.tasks.map( (task) => {
                    return (
                        <div key={task.taskId}>
                            <h5>{task.title}</h5>
                            <div>{task.message}</div>
                            <div>
                                <button className="stopred" style={{float:'right'}} onClick={() => this.onStop(task.taskId)}></button>
                                <ProgressBar now={task.percent} label={`${task.percent}%`}/>
                            </div>
                            <div>{task.status}</div>
                        </div>
                    )
                })}
            </div>
        )
     }
}

export default TabTasks;