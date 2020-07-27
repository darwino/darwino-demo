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
		Platform.log("-------------------------------------------------");
		Platform.log("DarwinoDB, Desktop Edition");
		Platform.log("This edition uses SQLite as the database engine.");
		Platform.log("It is not licensed to be used in production");
		Platform.log("-------------------------------------------------");
	}
	
	@Override
	public String defaultDarwinoDir() {
		return ".darwino-db-desk";
	}

	@SuppressWarnings("deprecation")
	public static void main(String[] args) throws Throwable {
		JettyMain main = new JettyMain();
		CommandLine.run(main, System.err, args);
		
//		Desktop.getDesktop().browse(new URL("http://localhost:8080").toURI());
	}
}
