/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
 */

package com.darwino.demo.platforms;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonJavaFactory;
import com.darwino.commons.json.JsonParser;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.demo.config.DemoConfiguration;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.mobile.platform.settings.SettingsRoot;


/**
 * Default Darwino settings
 * 
 * @author Philippe Riand
 */
public class DemoMobileManifest extends DarwinoMobileManifest {
	public static final String SERVER_URL	= "http://192.168.75.79:8080/";
	public static final String BRIDGE_URL	= "http://192.168.1.20:8087/";

	private String pathInfo;
	
	public DemoMobileManifest(String pathInfo) {
		this.pathInfo = pathInfo;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public Connection[] getPredefinedConnections() {
		ArrayList<Connection> conn = new ArrayList<DarwinoMobileManifest.Connection>();
		
		try {
			InputStream is = DemoConfiguration.loadResource("/predefined_connections.json", "/predefined_connections_default.json");
			Map<String, Object> connectionsObj = (Map<String, Object>)JsonParser.fromJson(JsonJavaFactory.instance, is);
			is.close();
			for(Map<String, Object> entry : (List<Map<String, Object>>)connectionsObj.get("connections")) {
				boolean enabled = (Boolean)entry.get("enabled");
				if(enabled) {
					Connection connection = new Connection();
					
					boolean local = (Boolean)entry.get("local");
					String baseName = (String)entry.get("name");
					String baseUrl = (String)entry.get("url");
					if(local) {
						// When we are running in the emulator, then we assume that the server is actually running in the VM
						// Else, we are on a local device and we access a global address
						boolean ethernet = DarwinoMobileApplication.get().getDevice().isDevEthernet();
						if(ethernet) {
							// Development ethernet connection
							connection.setName(StringUtil.format(baseName, SERVER_URL));
							connection.setUrl(StringUtil.format(baseUrl, PathUtil.concat(SERVER_URL, pathInfo, '/')));
						} else {
							// Real tablet, using the WIFI network
							connection.setName(StringUtil.format(baseName, BRIDGE_URL));
							connection.setUrl(PathUtil.concat(StringUtil.format(baseUrl, BRIDGE_URL), pathInfo, '/'));
						}
					} else {
						connection.setName(baseName);
						connection.setUrl(PathUtil.concat(baseUrl, pathInfo, '/'));
					}
					
					connection.setUserId((String)entry.get("userId"));
					connection.setUserPassword((String)entry.get("password"));
					connection.setDn((String)entry.get("dn"));
					connection.setCn((String)entry.get("cn"));
					conn.add(connection);
				}
			}
		} catch(JsonException le) {
			throw new RuntimeException("Error loading predefined-connections JSON file", le);
		} catch(IOException ioe) {
			throw new RuntimeException("Error loading predefined-connections JSON file", ioe);
		}

		return conn.toArray(new Connection[conn.size()]);
	}
}
