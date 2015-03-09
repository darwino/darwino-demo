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

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Store;

/**
 * Domino Discussion Database Definition.
 * 
 * @author Philippe Riand
 */
public class DiscDbDatabaseDef implements DatabaseFactory {

	public static final String DATABASE_DOMDISC	= "domdisc";
	public static final String STORE_NSFDATA	= "nsfdata";

	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equals(databaseName, DATABASE_DOMDISC)) {
			return null;
		}
		_Database db = new _Database(DATABASE_DOMDISC, "Domino Discussion", 1);

		db.setReplicationEnabled(true);
		db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		db.setInstanceEnabled(false);

		// Store: NSF data
		{
			_Store store = db.addStore(STORE_NSFDATA);
			store.setLabel("NSF Data");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");

			store.addQueryField("form", JsonUtil.TYPE_STRING, false);
		}

		return db;
	}
}
