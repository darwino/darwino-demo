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
import com.darwino.commons.json.JsonUtil;
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

	public static final int DATABASE_VERSION	= 2;

	public static final String STORE_NSFDATA       = "nsfdata"; //$NON-NLS-1$
	public static final String STORE_NSFDATA_LABEL = "NSF Data"; //$NON-NLS-1$
	public static final String STORE_CONFIG        = "config"; //$NON-NLS-1$
	public static final String STORE_CONFIG_LABEL  = "Configuration"; //$NON-NLS-1$

	public static final String DATABASE_NAME       = "domdisc"; //$NON-NLS-1$

	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		return DATABASE_VERSION;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return null;
		}
		_Database db = new _Database(DATABASE_NAME, "Domino Discussion", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		db.setInstanceEnabled(true);

		// Store: NSF data
		{
			_Store store = db.addStore(STORE_NSFDATA);
			store.setLabel(STORE_NSFDATA_LABEL);
			store.setFtSearchEnabled(true);
			_FtSearch ft = store.setFTSearch(new _FtSearch());
			ft.setFields("$"); //$NON-NLS-1$

			store.addQueryField("form", JsonUtil.TYPE_STRING, false); //$NON-NLS-1$
		}
		
		// Store: Configuration
		{
			_Store store = db.addStore(STORE_CONFIG);
			store.setLabel(STORE_CONFIG_LABEL);
			store.setFtSearchEnabled(true);
			_FtSearch ft = store.setFTSearch(new _FtSearch());
			ft.setFields("$"); //$NON-NLS-1$
			
			store.addQueryField("form", JsonUtil.TYPE_STRING, false); //$NON-NLS-1$
		}

		return db;
	}
}
