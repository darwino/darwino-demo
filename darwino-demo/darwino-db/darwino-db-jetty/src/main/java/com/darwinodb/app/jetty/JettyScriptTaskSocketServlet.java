/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

/**
 * Servlet for starting the sockets.
 */
@SuppressWarnings("serial")
public class JettyScriptTaskSocketServlet extends WebSocketServlet {
		 
    @Override
    public void configure(WebSocketServletFactory factory) {
        //factory.getPolicy().setIdleTimeout(10000);
        factory.register(JettyScriptTaskSocket.class);
    }
}
