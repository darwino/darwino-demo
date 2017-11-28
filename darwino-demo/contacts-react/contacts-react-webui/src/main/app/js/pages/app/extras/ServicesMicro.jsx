/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';

import { MicroServices } from '@darwino/darwino';
import { Messages } from '@darwino/darwino-react-bootstrap';

class ServicesMicro extends Component {

    constructor(props,context) {
        super(props,context)
        this.state = {
            error: false,
            result: null
        }
    }

    callMicroService(valid) {
        const {mainForm} = this.props;
        new MicroServices()
            .name(valid?"HelloWorld":"fake")
            .params({greetings: "I am the React client calling you"})
            .fetch()
            .then((r) => {
                this.setState({
                    error: false,
                    result: JSON.stringify(r,null,2)
                })
            })
            .catch((e) => {
                this.setState({
                    error: true,
                    result: e.message+"\n"+e.content
                })
            })
    }

    render() {
        return (
            <div>
                <div className="col-md-12 col-sm-12">
                    <p>
                        Micro services are simple JSON based services implemented on the server side that can 
                        be called by the client through a REST request. They optionally take a JSON payload 
                        as parameters and return a JSON result.
                    </p>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService(true)}>Call Micro service</Button>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService(false)}>Call Micro service - Error</Button>
                    </ButtonToolbar>
                    <br/>
                    {this.state.result &&
                        <pre style={this.state.error ? {color: 'red'} : {} }>
                            {this.state.result}
                        </pre>
                    }
                </div>
            </div>
        );
    }
}

export default ServicesMicro