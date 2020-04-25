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
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { Tabs, Tab } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import { DocumentForm} from '@darwino/darwino-react-bootstrap';

import ServicesMicro from "./ServicesMicro.jsx";
import ServicesRest from "./ServicesRest.jsx";

const FORM_NAME = "services";

//
// Demo page showing how to call services
//
class Services extends DocumentForm {

    render() {
        return (
            <div>
                {this.createMessages()}
                <form>
                    <FormattedMessage id='services.title' tagName='h2'/>
                    <Tabs defaultActiveKey={1} id="doctab">
                        <Tab eventKey={1} title={this.props.intl.formatMessage({id:"services.micro"})}>
                            <ServicesMicro mainForm={this}/>
                        </Tab>
                        <Tab eventKey={2} title={this.props.intl.formatMessage({id:"services.rest"})}>
                            <ServicesRest mainForm={this}/>
                        </Tab>
                    </Tabs>
                    {/*Uncomment to display the current JSON content*/}
                    {/* <JsonDebug form={this.props.form}/>   */}
                </form>
            </div>
        );
    }
}

const form = reduxForm({
    form: FORM_NAME,
    validate: DocumentForm.validateForm,
    onChange: DocumentForm.onChange
});

export default injectIntl(withRouter(
    connect(null,DocumentForm.mapDispatchToProps)
        (form(Services)))
)
