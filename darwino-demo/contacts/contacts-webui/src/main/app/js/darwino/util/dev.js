/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

const DEV_OPTIONS = {
    DEVELOPMENT: false,
    WEBPACK: false,

    // Prefix to be added to the URL when using webpack
    // Note that the Darwino server must implement CORS, which is easily done using a filter
    serverPrefix: null,

    // In a prod app, the credentials should only be passed to the same origin
    // But for dev, we always include the credentials
    credentials: "same-origin"
}
export default DEV_OPTIONS;

export function initDevOptions(DEVELOPMENT,dwoUrl) {
    DEV_OPTIONS.DEVELOPMENT=DEVELOPMENT;
    let devpack = window.location.port==8008
    if(devpack) {
        DEV_OPTIONS.WEBPACK = true;
        DEV_OPTIONS.serverPrefix = dwoUrl;
        DEV_OPTIONS.credentials = "include";
    }
}

