/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import java.util.ArrayList;
import java.util.List;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.meta._Database;
import com.darwino.platform.DarwinoApplication;



/**
 * Darwino DB Environment.
 * 
 * @author priand
 */
public class DarwinoDBEnvironment {

	private static DarwinoDBEnvironment instance = new DarwinoDBEnvironment();
	
	public static DarwinoDBEnvironment get() {
		return instance;
	}
	
	DarwinoDBEnvironment() {
		DarwinoApplication app = DarwinoApplication.get();
		
		// Read the database design elements (replication, tasks...)
		// TODO..
	}
	
	public List<_Database> getUserDatabases() throws JsonException {
		DarwinoApplication app = DarwinoApplication.get();
		String[] dbs = app.getLocalJsonDBServer().getDatabaseList();
		
		List<_Database> result = new ArrayList<_Database>();
		for(int i=0; i<dbs.length; i++) {
			// The database could have been removed since the names were loaded!
			String dbName = dbs[i];
			_Database db = app.getLocalJsonDBServer().getDatabaseMetaData(dbName);
			if(db!=null) {
				result.add(db);
			}
		}
		return result;
	}
}
