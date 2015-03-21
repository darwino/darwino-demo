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

package com.darwino.demo.dominodisc;

import java.util.Calendar;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.extensions.ExtensionRegistry;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.replication.ReplicationGroup;
import com.darwino.jsonstore.replication.ReplicationGroupSimple;
import com.darwino.jsonstore.replication.ReplicationProfile;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * Discussion Database Application Manifest.
 * 
 * @author Philippe Riand
 */
public class DiscDbManifest extends DarwinoManifest {
	
	public static final String MOBILE_PATHINFO	= "dominodisc";
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}

	public static Database getDatabase() throws JsonException {
		return getSession().getDatabase(DiscDbDatabaseDef.DATABASE_DOMDISC);
	}
	
	public static Store getNSFDataStore() throws JsonException {
		return getDatabase().getStore(DiscDbDatabaseDef.STORE_NSFDATA);
	}
	

	private boolean mobile;
	
	public DiscDbManifest(boolean mobile, Section section) {
		super(section);
		this.mobile = mobile;
	}
	
	@Override
	public String getLabel() {
		return "Discussion Database";
	}
	
	@Override
	public String getDescription() {
		return "Domino discussion database";
	}
	
	@Override
	public String getMainPageUrl() {
		return "mobile/index.html";
	}
	
	@Override
	public String[] getDatabases() {
		return new String[] { 
			DiscDbDatabaseDef.DATABASE_DOMDISC,
		};
	}
	
	@Override
	public DatabaseFactory getDatabaseFactory(String dbName) {
		if(dbName.equals(DiscDbDatabaseDef.DATABASE_DOMDISC)) { 
			return new DiscDbDatabaseDef();
		}
		return null;
	}
	
	@Override
	public ExtensionRegistry getExtensionRegistry() {
		return new DiscDbBusinessLogic();
	}
	
	@Override
	public ReplicationGroup getSynchronizationGroup() {
		if(mobile) {
			// Limit the sync entries here
			// Should we use max entries instead?
			return new ReplicationGroupSimple(getDatabases()) {
				@Override
				public ReplicationProfile getProfile(int index) {
					ReplicationProfile p = new ReplicationProfile();
					// Oct 1st 2014
					Calendar cal = Calendar.getInstance();
					cal.set(2014, 10-1, 1, 0, 0, 0);
					p.setStartTime(cal.getTime().getTime());
					//System.out.println("Selective replication, start date="+(new Date(p.getStartTime())).toString());
					return p;
				}
			};
		} else {
			return super.getSynchronizationGroup();
		}
		
	}
}
