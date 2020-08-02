/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.jetty;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.darwino.commons.Platform;
import com.darwino.commons.util.NativeUtil;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.commons.util.security.StringObfuscator;
import com.darwino.commons.util.security.StringObfuscatorAES;
import com.darwinodb.app.Main;

import picocli.CommandLine.Option;

/**
 * Main Entry Point.
 */
public abstract class AbstractJettyMain extends Main {
	
	private File configDir;
	private File filesDir;
	private StringObfuscator stringObfuscator;
	private JettyServer jettyServer;

	protected AbstractJettyMain() {		
	}
	
	@Override
	public File getConfigDir() {
		return this.configDir;
	}
	
	@Override
	public File getFilesDir() {
		return this.filesDir;
	}

	@Override
	public StringObfuscator getStringObfuscator() {
		return stringObfuscator;
	}

	public JettyServer getJettyServer() {
		return jettyServer;
	}

	public abstract void welcomeMessage();
	public abstract String defaultDarwinoDir();
	
	public void postServerStart() {}
	

	@Option(names = {"-p", "--port"}, description = "Server Port")
	public int port = 8080;

	@Option(names = {"-d", "--darwinodir"}, description = "Darwino directory")
	public String darwinoDir = null;
	
	
	private void copyConfig(String name) throws IOException {
		File f = new File(configDir,name);
		if(!f.exists()) {
			InputStream is = getClass().getClassLoader().getResourceAsStream(PathUtil.concat("configuration",name));
			try {
				OutputStream os = new FileOutputStream(f);
				try {
					StreamUtil.copyStream(is, os);
					Platform.log("Installed configuration file: {0}",f);
				} finally {
					StreamUtil.close(os);
				}
			} finally {
				StreamUtil.close(is);
			}
		}
	}
	
	@Override
	public void run() {
		try {
			// Find the use configuration
			if(StringUtil.isEmpty(darwinoDir)) {
				this.configDir = new File((String)System.getProperty("user.home"),defaultDarwinoDir());
			} else {
				this.configDir = new File(darwinoDir);
				
			}
			configDir = configDir.getCanonicalFile();
			configDir.mkdirs();
			Platform.log("Configuration directory: {0}",configDir);
			
			filesDir = new File(configDir,"files");
			
			stringObfuscator = StringObfuscatorAES.create(new File(configDir,"obfuscator.json"));
			
			// Install the native path for the jni libraries
			NativeUtil.setInstallPath(new File(configDir,".native"));
			
			// Set the darwino-db dir as a property
			Platform.getPropertyService().putProperty("DARWINODB-ROOTDIR", configDir.getAbsolutePath());
			
			// Copy configuration files
			copyConfig("darwino-beans.xml");
			copyConfig("darwino.properties");
			
			jettyServer = new JettyServer(this);
			jettyServer.run();
		} catch (Throwable t) {
			t.printStackTrace();
		}
	}

}
