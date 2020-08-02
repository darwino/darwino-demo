/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import com.darwino.commons.Platform;

/**
 * Jetty Server.
 */
public class JettyServer {

	private AbstractJettyMain options;
	private Server server;
	
	public JettyServer(AbstractJettyMain options) {
		this.options = options;
	}
	
	public String getMainURI() {
		return server.getURI().toString();
	}

	public void run() throws Exception {
		Platform.log(">> Running");
        WebAppContext webAppContext = new WebAppContext();
        
        // Devenv - local files
        //webAppContext.setDescriptor("src/main/resources/webapp/WEB-INF/web.xml");
        //webAppContext.setResourceBase("src/main/resources/webapp");
        
        // Compiled jar
        webAppContext.setDescriptor(JettyServer.class.getResource("/webapp/WEB-INF/web.xml").toString());
        webAppContext.setResourceBase(JettyServer.class.getResource("/webapp").toString());

        webAppContext.setContextPath("/");

        server = new Server(options.port);
        server.setHandler(webAppContext);
        server.start();

        options.welcomeMessage();
        options.postServerStart();
        
        server.join();
	}

}

