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
import { makeWsUrl } from '@darwino/darwino';


class NotificationCenter {

    constructor() {
        this.ws = null;
        this.listeners = []
    }

    addListener(l) {
        this._removeListener(l); // Make sure...
        this.listeners.push(l);
        if(!this.ws) {
            this.installSocket();
        }
        if(this.ws.readyState===WebSocket.OPEN) {
            l.onOpen && l.onOpen();
        }
    }

    removeListener(l) {
        this._removeListener(l); // Make sure...
        if(this.listeners.length===0 & this.ws) {
            this.uninstallSocket();
        }
        l.onClose && l.onClose();
    }

    _removeListener(l) {
        const idx = this.listeners.indexOf(l);
        if(l>=0) this.listeners.splice(idx,1)
    }

    installSocket() {
        if(!this.ws) {
            const wsUrl = makeWsUrl("/websocket/tasksstatus");
            const ws = new WebSocket(wsUrl);
            ws.addEventListener('message', (event) => {
                //console.log("Socket message")
                const {command,...msg} = JSON.parse(event.data);;
                //console.log(`Socket command: ${command}, ${JSON.stringify(msg)}`)
                this.listeners.forEach( (l) => {
                    l.onCommand && l.onCommand(command,msg)
                });
            });
            ws.addEventListener('open', () => {
                //console.log("Socket open")
                this.listeners.forEach( (l) => {
                    l.onOpen && l.onOpen();
                });
            });            
            ws.addEventListener('close', () => {
                //console.log("Socket close")
                this.uninstallSocket();
                this.installSocketDelayed();
            });
            ws.addEventListener('onerror', () => {
                //console.log("Socket onerror")
                this.uninstallSocket();
                this.installSocketDelayed();
            });
            this.ws = ws;
        }
    }

    installSocketDelayed() {
        setTimeout( () => {
            this.installSocket()
        },1000);
    }

    uninstallSocket() {
        if(this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    sendCommand(command,parameters) {
        if(this.ws) {
            const json = {
                command,
                parameters
            }
            this.ws.send(JSON.stringify(json));
        }
    }
}

export const notificationCenter = new NotificationCenter();
