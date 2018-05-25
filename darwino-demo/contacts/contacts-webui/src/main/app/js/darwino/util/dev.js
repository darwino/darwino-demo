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

