/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { Messages } from '@darwino/darwino-react-bootstrap';

class CodeMessages extends Component {

    render() {
        const {mainForm} = this.props;
        return (
            <div className="col-md-12 col-sm-12">
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 1,
                            title: "Gasp, an error",
                            message: "Next time, choose a different button my friend",
                            type: Messages.ERROR
                        })}>Display Error</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 2,
                            title: "Now a warning",
                            message: "Getting better, but now you have to do more",
                            type: Messages.WARNING
                        })}>Display Warning</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 3, // Same as information
                            title: "Success!",
                            message: "Finally, you got some success",
                            type: Messages.SUCCESS
                        })}>Display Success</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 3, // Same as success
                            title: "Information",
                            message: "You're right, stay at the info level",
                            type: Messages.INFO
                        })}>Display Info</Button>
                    <Button bsStyle="danger" onClick={()=>
                        mainForm.getMessages().clear()
                        }>Clear All</Button>
                </ButtonToolbar>
            </div>
        );
    }
}

export default CodeMessages