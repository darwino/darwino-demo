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
import React, {Component} from "react";
import { Button, ButtonToolbar } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MicroServices } from '@darwino/darwino';

class ServicesMicro extends Component {

    constructor(props,context) {
        super(props,context)
        this.state = {
            error: false,
            result: null
        }
    }

    callMicroService(name) {
        new MicroServices()
            .name(name)
            .params({greetings: this.props.intl.formatMessage({id:"microsvc.clientstr"})})
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
                if(window.rollbar) {
                    // Don't need to localize, as this goes to the rollbar server
                    const errorContext = (e.jsonContent && e.jsonContent.errorContext)||"";
                    window.rollbar.error("Client "+errorContext+", Calling micro service '"+name+"', "+e.message+"\n"+e.content,e);
                }
            })
    }

    render() {
        return (
            <div>
                <div className="col-md-12 col-sm-12">
                    <FormattedMessage id='microsvc.desc' tagName='p'/>
                </div>
                <div className="col-md-12 col-sm-12">
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService("HelloWorld")}>
                            <FormattedMessage id='microsvc.callmicrosvc'/>
                        </Button>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService("fake")}>
                            <FormattedMessage id='microsvc.callmicrosvcfake'/>
                        </Button>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService("ServerError")}>
                            <FormattedMessage id='microsvc.callmicrosvcerr'/>
                        </Button>
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

export default injectIntl(ServicesMicro)