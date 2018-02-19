/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React, {Component} from "react";
import { Button, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import {  _t } from '@darwino/darwino';
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
                            title: _t("codemsg.error","Gasp, an error"),
                            message: _t("codemsg.errormsg","Next time, choose a different button my friend"),
                            type: Messages.ERROR
                        })}>{_t("codemsg.errordisp","Display Error")}</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 2,
                            title: _t("codemsg.warn","Now a warning"),
                            message: _t("codemsg.warnmsg","Getting better, but now you have to do more"),
                            type: Messages.WARNING
                        })}>{_t("codemsg.errorwarn","Display Warning")}</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 3, // Same as information
                            title: _t("codemsg.success","Success!"),
                            message: _t("codemsg.successmsg","Finally, you got some success"),
                            type: Messages.SUCCESS
                        })}>{_t("codemsg.successdisp","Display Success")}</Button>
                    <Button bsStyle="primary" onClick={()=>
                        mainForm.getMessages().add({
                            key: 3, // Same as success
                            title: _t("codemsg.info","Information"),
                            message: _t("codemsg.infomsg","You're right, stay at the info level"),
                            type: Messages.INFO
                        })}>{_t("codemsg.infodisp","Display Info")}</Button>
                    <Button bsStyle="danger" onClick={()=>
                        mainForm.getMessages().clear()
                        }>{_t("codemsg.clearall","Clear All")}</Button>
                </ButtonToolbar>
            </div>
        );
    }
}

export default CodeMessages