/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import React from "react";
import DEV_OPTIONS from '../../darwino-react/util/dev';

const AdminConsole = () => {
    return (
        <div style={{width: '100%', height: '800px'}}>
            <iframe src={`${DEV_OPTIONS.serverPrefix}$darwino-debug/commands.html`} id="commands" width="100%" height="100%" frameBorder={0} scrolling="auto">
            </iframe>
        </div>
    )
}

export default AdminConsole