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

package com.darwino.playground.app;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.extensions.ExtensionRegistry;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.replication.ReplicationGroup;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppManifest extends DarwinoManifest {
	
	// This is used by the mobile application to call the remote service
	public static final String MOBILE_PATHINFO	= "playground";
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}

	public static Database getDatabase() throws JsonException {
		return getSession().getDatabase(AppDatabaseDef.DATABASE_NAME);
	}
	

	private boolean mobile;
	
	public AppManifest(boolean mobile, Section section) {
		super(section);
		this.mobile = mobile;
	}
	
	@Override
	public String getLabel() {
		return "Darwino Playground";
	}
	
	@Override
	public String getDescription() {
		return "Darwino Playground";
	}
	
	@Override
	public String getMainPageUrl() {
		return "mobile/index.html";
	}
	
	@Override
	public String[] getDatabases() {
		return new String[] { 
			AppDatabaseDef.DATABASE_NAME,
		};
	}
	
	@Override
	public DatabaseFactory getDatabaseFactory(String dbName) {
		if(dbName.equals(AppDatabaseDef.DATABASE_NAME)) { 
			return new AppDatabaseDef();
		}
		return null;
	}
	
	@Override
	public ExtensionRegistry getExtensionRegistry() {
		return new AppDBBusinessLogic();
	}
	
	@Override
	public ReplicationGroup getSynchronizationGroup() {
		//Add replication constraints here for mobile devices 		
		if(mobile) {
//			// Example on limiting the sync entries here
//			return new ReplicationGroupSimple(getDatabases()) {
//				@Override
//				public ReplicationProfile getProfile(int index) {
//					ReplicationProfile p = new ReplicationProfile();
//					// Oct 1st 2014
//					p.setStartTime((new Date(2014-1900,10-1,1)).getTime());
//					//System.out.println("Selective replication, start date="+(new Date(p.getStartTime())).toString());
//					return p;
//				}
//			};
		}
		return super.getSynchronizationGroup();
	}
}
