/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonObject;
import com.darwinodb.app.scripts.BaseSocket;
import com.darwinodb.app.scripts.ServerSocket;

/**
 * Jetty specific socket.
 */
public abstract class JettyServerSocket extends WebSocketAdapter implements ServerSocket {
	
	public JettyServerSocket() {
	}
	
	public abstract BaseSocket getBaseSocket();
	
	
	//
	// Send a JSON object to the listener
	//

	@Override
	public void emit(String json) {
		try {
			if(isConnected()) {
				getRemote().sendString(json);
			}
		} catch(Exception e) {
			Platform.log(e);
		}
	}

	@Override
	public void closeSocket() {
		try {
			if(isConnected()) {
				getSession().close();
			}
		} catch(Exception e) {
			Platform.log(e);
		}
	}

	
	//
	// Socket implementation
	//
	
    @Override
    public void onWebSocketConnect(Session sess) {
    	super.onWebSocketConnect(sess);
    	Platform.log("onWebSocketConnect");
    	
    	getBaseSocket().onConnect();
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
    	super.onWebSocketClose(statusCode, reason);
    	Platform.log("onWebSocketClose");
    	
    	getBaseSocket().onDisconnect();
    }

    @Override
    public void onWebSocketError(Throwable cause) {
    	super.onWebSocketError(cause);
    	Platform.log("onWebSocketError");

    	getBaseSocket().onError();
    }

    @Override
    public void onWebSocketText(String command) {
    	Platform.log("onWebSocketText");
    	if(isConnected()) {
    		try {
    			JsonObject o = JsonObject.fromJson(command);
    	    	String c = o.getString("command");
    	    	JsonObject  p = o.getObject("parameters");
    	    	getBaseSocket().onCommand(c,p);
    		} catch(Throwable ex) {
    			Platform.log(ex);
    			getBaseSocket().onError();
    		}
    	}
    }

    @Override
    public void onWebSocketBinary(byte[] payload, int offset, int len) {
    	super.onWebSocketBinary(payload, offset, len);
    	Platform.log("onWebSocketBinary");
    }
}
