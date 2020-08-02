/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import com.darwino.commons.Platform;

import picocli.CommandLine;

/**
 * Main Entry Point.
 */
public class JettyMain extends AbstractJettyMain {
	
	@Override
	public void welcomeMessage() {
		Platform.log("");
		Platform.log("-------------------------------------------------");
		Platform.log("DarwinoDB, Server Edition");
		Platform.log("{0}", getJettyServer().getMainURI());
		Platform.log("-------------------------------------------------");
		Platform.log("");
	}
	
	@Override
	public String defaultDarwinoDir() {
		return ".darwino-db";
	}

	
	@SuppressWarnings("deprecation")
	public static void main(String[] args) throws Throwable {
		JettyMain main = new JettyMain();
		CommandLine.run(main, System.err, args);
	}
}
