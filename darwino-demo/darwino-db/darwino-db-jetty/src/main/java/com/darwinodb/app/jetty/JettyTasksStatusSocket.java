/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import com.darwinodb.app.scripts.TasksStatusSocket;

/**
 * Jetty specific socket.
 */
public class JettyTasksStatusSocket extends JettyServerSocket {
	
	
	private TasksStatusSocket socket;
	
	public JettyTasksStatusSocket() {
		this.socket = new TasksStatusSocket(this);
	}
	
	@Override
	public TasksStatusSocket getBaseSocket() {
		return socket;
	}
}
