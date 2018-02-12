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

    callMicroService(valid) {
        const {mainForm} = this.props;
        new MicroServices()
            .name(valid?"HelloWorld":"fake")
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
                        <Button bsStyle="primary" onClick={()=>this.callMicroService(true)}>
                            <FormattedMessage id='microsvc.callmicrosvc'/>
                        </Button>
                        <Button bsStyle="primary" onClick={()=>this.callMicroService(false)}>
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