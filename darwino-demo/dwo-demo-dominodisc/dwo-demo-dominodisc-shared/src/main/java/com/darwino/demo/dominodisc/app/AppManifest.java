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

package com.darwino.demo.dominodisc.app;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.extensions.ExtensionRegistry;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppManifest extends DarwinoManifest {
	
	// This is used by the mobile application to call the remote service
	public static final String MOBILE_PATHINFO	= "dominodisc";
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}

	public static Database getDatabase() throws JsonException {
		return getSession().getDatabase(AppDatabaseDef.DATABASE_NAME);
	}
	
	public static Store getNSFDataStore() throws JsonException {
		return getDatabase().getStore(AppDatabaseDef.STORE_NSFDATA);
	}	

	public AppManifest(Section section) {
		super(section);
	}
	
	@Override
	public String getLabel() {
		return "Discussion Database";
	}
	
	@Override
	public String getDescription() {
		return "Domino Discussion Database";
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
		String[] databases = getDatabases();
		if(databases!=null) {
			for(int i=0; i<databases.length; i++) {
				if(dbName.equals(databases[i])) { 
					return new AppDatabaseDef();
				}
			}
		}
		return null;
	}
	
	@Override
	public ExtensionRegistry getExtensionRegistry() {
		return new AppDBBusinessLogic();
	}
}
