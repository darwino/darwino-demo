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

package com.darwino.app;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;

/**
 * Database Definition.
 * 
 * @author Philippe Riand
 */
public class AppDatabaseDef extends DatabaseFactoryImpl {

	public static final int DATABASE_VERSION	= 1;
	public static final String DATABASE_NAME	= "ngsocial";
	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		return DATABASE_VERSION;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equals(databaseName, DATABASE_NAME)) {
			return null;
		}
		_Database db = new _Database(DATABASE_NAME, "Angular Social", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		db.setInstanceEnabled(false);

		// Store...
		{
//			_Store store = db.addStore("MyStore");
//			store.setLabel("My Store");
//			store.setFtSearchEnabled(true);
//			
//			// Search the whole document (all fields)
//			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
//			ft.setFields("$");
		}

		return db;
	}
}
