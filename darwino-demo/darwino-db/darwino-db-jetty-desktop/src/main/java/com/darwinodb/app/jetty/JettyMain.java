/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import java.awt.Desktop;
import java.net.URI;

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
		Platform.log("DarwinoDB, Desktop Edition");
		Platform.log("{0}", getJettyServer().getMainURI());
		Platform.log("-------------------------------------------------");
		Platform.log("");
	}
	
	@Override
	public void postServerStart() {
		openBrowser();
	}

	
	@Override
	public String defaultDarwinoDir() {
		return ".darwino-db-desk";
	}

	@SuppressWarnings("deprecation")
	public static void main(String[] args) throws Throwable {
		JettyMain main = new JettyMain();
		CommandLine.run(main, System.err, args);
	}
	
	public void openBrowser() {
		Desktop desktop = java.awt.Desktop.getDesktop();
		try {
			//specify the protocol along with the URL
			URI oURL = new URI(getJettyServer().getMainURI());
			desktop.browse(oURL);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
