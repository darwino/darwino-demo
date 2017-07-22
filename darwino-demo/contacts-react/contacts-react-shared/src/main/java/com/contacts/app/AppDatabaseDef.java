/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Store;

/**
 * Database Definition.
 * 
 * @author Philippe Riand
 */
public class AppDatabaseDef extends DatabaseFactoryImpl {

	// V2: added FT search
	public static final int DATABASE_VERSION	= 3;
	public static final String DATABASE_NAME	= "contacts";
	
    public static final String[] DATABASES = new String[] {
    	DATABASE_NAME
    };
	
	// The list  of instances is defined through a property for the DB
	public static String[] getInstances() {
		//JsonArray a = new JsonArray(session.getDatabaseInstances(dbName));
		String inst = Platform.getProperty("contacts.instances");
		if(StringUtil.isNotEmpty(inst)) {
			return StringUtil.splitString(inst, ',', true);
		}
		return null;
	}	

	@Override
    public String[] getDatabases() throws JsonException {
		return DATABASES;
	}
	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		if(StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return DATABASE_VERSION;
		}
		return -1;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return loadDatabase_contacts();
		}
		return null;
	}
	
	public _Database loadDatabase_contacts() throws JsonException {
		_Database db = new _Database(DATABASE_NAME, "Contacts React", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		
		// Document base security
//		db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		
		// Instances are only available with the enterprise edition
//		if(Lic.isEnterpriseEdition()) {
//			db.setInstanceEnabled(true);
//		}
		
		// Customize the default stores, if desired...
//		{
//			_Store _def = db.getStore(Database.STORE_DEFAULT);
//			_def.setFtSearchEnabled(true);
//			_FtSearch ft = (_FtSearch) _def.setFTSearch(new _FtSearch());
//			ft.setFields("$");
//		}

		// Stores...
		{
			_Store store = db.addStore("contacts");
			store.setLabel("Contacts");
			store.setFtSearchEnabled(true);
			
			// Search the whole document (all fields)
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}
		{
			_Store store = db.addStore("companies");
			store.setLabel("Companies");
			store.setFtSearchEnabled(true);
			
			// Search the whole document (all fields)
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}

		return db;
	}
}
