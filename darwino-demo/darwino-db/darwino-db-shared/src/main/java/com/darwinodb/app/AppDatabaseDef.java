/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Store;

/**
 * Database Definition.
 */
public class AppDatabaseDef extends DatabaseFactoryImpl {

	public static final int DATABASE_VERSION	= 1;
	public static final String DATABASE_NAME	= "system";

	public static final String STORE_CONNECTIONS_NAME	= "connections";
	public static final String STORE_REPLICATIONS_NAME	= "replications";
	public static final String STORE_TASKS_NAME			= "tasks";
	public static final String STORE_SQL_NAME			= "sql";
	public static final String STORE_JSQL_NAME			= "jsql";
	public static final String STORE_COMMANDS_NAME		= "commands";
	public static final String STORE_SCRIPTS_NAME		= "scripts";
	public static final String STORE_USERS_NAME		= "users";
	
    public static final String[] DATABASES = new String[] {
    	DATABASE_NAME
    };
	
	// The list  of instances is defined through a property for the DB
	public static String[] getInstances() {
		//JsonArray a = new JsonArray(session.getDatabaseInstances(dbName));
		String inst = Platform.getProperty("system.instances");
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
			return loadDatabase_system();
		}
		return null;
	}
	
	public _Database loadDatabase_system() throws JsonException {
		_Database db = new _Database(DATABASE_NAME, "Darwino DB System", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		
		// Document base security
//		db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		
		// Instances are only available with the enterprise edition
//		if(Lic.isEnterpriseEdition()) {
//			db.setInstanceEnabled(true);
//		}

		// Stores
		{
			_Store store = db.addStore("users");
			store.setLabel("Users");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}
		{
			_Store store = db.addStore(STORE_CONNECTIONS_NAME);
			store.setLabel("Connections");
		}
		{
			_Store store = db.addStore(STORE_REPLICATIONS_NAME);
			store.setLabel("Replications");
		}
		{
			_Store store = db.addStore(STORE_TASKS_NAME);
			store.setLabel("Tasks");
		}
		{
			_Store store = db.addStore(STORE_SCRIPTS_NAME);
			store.setLabel("Scripts");
		}
		{
			_Store store = db.addStore(STORE_COMMANDS_NAME);
			store.setLabel("Commands");
		}
		{
			_Store store = db.addStore(STORE_SQL_NAME);
			store.setLabel("Sql");
		}
		{
			_Store store = db.addStore(STORE_JSQL_NAME);
			store.setLabel("Jsql");
		}
		{
			_Store store = db.addStore(STORE_USERS_NAME);
			store.setLabel("Users");
		}

		return db;
	}
}
