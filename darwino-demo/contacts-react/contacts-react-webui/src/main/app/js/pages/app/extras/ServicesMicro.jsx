/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MicroServices, I18N } from '@darwino/darwino';
import { Messages } from '@darwino/darwino-react-bootstrap';

class ServicesMicro extends Component {

    constructor(props,context) {
        super(props,context)
        this.state = {
            error: false,
            result: null
        }
    }

    callMicroService(name) {
        const {mainForm} = this.props;
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