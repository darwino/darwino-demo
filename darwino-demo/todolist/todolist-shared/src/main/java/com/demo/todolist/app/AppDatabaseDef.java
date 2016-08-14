/*!COPYRIGHT HEADER! 
 *
 */

package com.demo.todolist.app;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
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

	public static final int DATABASE_VERSION	= 2;
	public static final String DATABASE_NAME	= "todolist";
	public static final String STORE_TODO		= "todos";
	
	public static String[] getInstances() {
		return null;
	}	
	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		if(!StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return -1;
		}
		return DATABASE_VERSION;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return null;
		}
		_Database db = new _Database(DATABASE_NAME, "Todo List", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		
		// Instance are only available with the enterprise edition
		db.setInstanceEnabled(true);
		
		// Store...
		{
			_Store store = db.addStore(STORE_TODO);
			store.setLabel("TODOs");
			store.setFtSearchEnabled(true);
			
			// Search the whole document (all fields)
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}

		return db;
	}
}
