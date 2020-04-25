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