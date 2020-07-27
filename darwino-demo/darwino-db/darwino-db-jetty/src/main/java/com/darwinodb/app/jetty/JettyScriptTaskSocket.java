/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import com.darwinodb.app.scripts.ScriptTaskSocket;

/**
 * Jetty specific socket.
 */
public class JettyScriptTaskSocket extends JettyServerSocket {
	
	
	private ScriptTaskSocket socket;
	
	public JettyScriptTaskSocket() {
		this.socket = new ScriptTaskSocket(this);
	}
	
	@Override
	public ScriptTaskSocket getBaseSocket() {
		return socket;
	}
}
