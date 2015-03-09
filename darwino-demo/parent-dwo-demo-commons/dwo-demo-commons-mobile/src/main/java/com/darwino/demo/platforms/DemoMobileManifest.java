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

import java.util.ArrayList;

import com.darwino.commons.util.PathUtil;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;


/**
 * Default Darwino settings for a Triloggroup environment.
 * 
 * @author Philippe Riand
 */
public class DemoMobileManifest extends DarwinoMobileManifest {
	
	public static final boolean HEROKU = false;			// To use the Heroku deployment
	public static final boolean BLUEMIX = false;		// To use the IBM Bluemix deployment
	
	public static final String SERVER_URL	= "http://192.168.75.79:8080/";
	public static final String BRIDGE_URL	= "http://192.168.1.20:8087/";
	public static final String HEROKU_URL	= "http://priand-demo-news.herokuapp.com";
	public static final String BLUEMIX_URL	= "http://darwino-demo-news.bluemix.ibm.com";

	public static final String USER_ID	= "amass";
	public static final String USER_PWD	= "floflo";

	private String pathInfo;
	
	public DemoMobileManifest(String pathInfo) {
		this.pathInfo = pathInfo;
	}
	
	@Override
	public Connection[] getPredefinedConnections() {
		ArrayList<Connection> conn = new ArrayList<DarwinoMobileManifest.Connection>();
		
		// 1- Add the local connection
		Connection local = createLocalConnection();
		if(local!=null) {
			conn.add(local);
		}
		
		// 2- Add bluemix connection
		Connection bluemix = createBluemixConnection();
		if(bluemix!=null) {
			conn.add(bluemix);
		}

		return conn.toArray(new Connection[conn.size()]);
	}
	
	protected Connection createLocalConnection() {
		Connection localConnection = new Connection();
		localConnection.setName("Local Server");
		// Initialize the server configuration
		// When we are running in the emulator, then we assume that the server is actually running in the VM
		// Else, we are on a local device and we access a global address
		boolean ethernet = DarwinoMobileApplication.get().getDevice().isDevEthernet();
		if(ethernet) {
			// Development ethernet connection
			localConnection.setName("Local Server - "+SERVER_URL);
			localConnection.setUrl(PathUtil.concat(SERVER_URL,pathInfo,'/'));
		} else {
			// Real tablet, using the WIFI network
			localConnection.setName("Local Server - "+BRIDGE_URL);
			localConnection.setUrl(PathUtil.concat(BRIDGE_URL,pathInfo,'/'));
		}
		localConnection.setUserId(USER_ID);
		localConnection.setUserPassword(USER_PWD);
		localConnection.setValid(true);
		localConnection.setDn("cn=al mass,o=triloggroup");
		localConnection.setCn("Al Mass");
		return localConnection;
	}
	
	protected Connection createBluemixConnection() {
		Connection bluemix = new Connection();
		bluemix.setName("Bluemix");
		bluemix.setName("IBM Bluemix - "+BLUEMIX_URL);
		bluemix.setUrl(PathUtil.concat(BLUEMIX_URL,pathInfo,'/'));
		bluemix.setUserId(USER_ID);
		bluemix.setUserPassword(USER_PWD);
		//bluemix.setValid(true);
		//bluemix.setDn("cn=al mass,o=triloggroup");
		//bluemix.setCn("Al Mass");
		return bluemix;
	}
}
