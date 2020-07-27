/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

/**
 * Abstract a communication socket.
 * 
 * Different web application servers are using different abstraction
 */
public interface ServerSocket {
	
	public void emit(String json);
	
	public void closeSocket();
}
