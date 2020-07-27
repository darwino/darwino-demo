/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import com.darwino.commons.json.JsonObject;

/**
 * Base for a task notification socket 
 */
public abstract class BaseSocket  {
	
	private ServerSocket serverSocket;
	
	public BaseSocket(ServerSocket socket) {
		this.serverSocket = socket;
	}

	public ServerSocket getServerSocket() {
		return serverSocket;
	}
		
	
	
	public void onCommand(String command, JsonObject parameters) {
    }
	
	public void onConnect() {
    }
    
	public void onDisconnect() {
    }
	
	public void onError() {
    }
}
