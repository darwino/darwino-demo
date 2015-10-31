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

import java.io.InputStream;
import java.util.ArrayList;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonJavaFactory;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.json.JsonParser;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.demo.config.DemoConfiguration;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileSettings.Connection;


/**
 * Default Darwino settings
 * 
 * @author Philippe Riand
 */
public class DemoMobileManifest extends DarwinoMobileManifest {
	
	private String pathInfo;
	
	public DemoMobileManifest(String pathInfo) {
		this.pathInfo = pathInfo;
	}
	
	@Override
	public Connection[] getPredefinedConnections() {
		ArrayList<Connection> conn = new ArrayList<Connection>();
		
		try {
			InputStream is = DemoConfiguration.loadResource("/predefined_connections.json", "/predefined_connections_default.json");
			if(is!=null) {
				try {
					JsonObject connectionsObj = (JsonObject)JsonParser.fromJson(JsonJavaFactory.instance, is);
					for(Object entryObj : connectionsObj.getArray("connections")) {
						JsonObject entry = (JsonObject)entryObj;
						boolean enabled = entry.getBoolean("enabled");
						if(enabled) {
							Connection connection = new Connection();
							
							boolean local = entry.getBoolean("local");
							String baseName = entry.getString("name");
							String baseUrl = entry.getString("url");
							if(local) {
								// When we are running in the emulator, then we assume that the server is actually running in the VM
								// Else, we are on a local device and we access a global address
								boolean ethernet = DarwinoMobileApplication.get().getDevice().isDevEthernet();
								if(ethernet) {
									String url = findServerUrl();
									// Development ethernet connection
									connection.setName(StringUtil.format(baseName, url));
									connection.setUrl(StringUtil.format(baseUrl, PathUtil.concat(url, pathInfo, '/')));
								} else {
									String url = findBridgeUrl();
									// Real tablet, using the WIFI network
									connection.setName(StringUtil.format(baseName, url));
									connection.setUrl(PathUtil.concat(StringUtil.format(baseUrl, url), pathInfo, '/'));
								}
							} else {
								connection.setName(baseName);
								connection.setUrl(baseUrl);
							}
							
							String userId = entry.getString("userId");
							String dn = entry.getString("dn");
							if(StringUtil.isNotEmpty(userId)) {
								connection.setUserId(userId);
							} else {
								connection.setUserId(dn);
							}
							connection.setUserPassword(entry.getString("password"));
							connection.setDn(dn);
							connection.setCn(entry.getString("cn"));
							conn.add(connection);
						}
					}
				} finally {
					StreamUtil.close(is);
				}
			}
		} catch(JsonException le) {
			throw new RuntimeException("Error loading predefined-connections JSON file", le);
		}

		return conn.toArray(new Connection[conn.size()]);
	}
	public String findServerUrl() {
		//return "http://10.0.1.8:8081/";
		return "http://192.168.75.79:8080/";
	}
	public String findBridgeUrl() {
		return "http://192.168.1.20:8080/";
	}
}
