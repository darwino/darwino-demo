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

package com.darwino.application.jsonstore;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Index;
import com.darwino.jsonstore.meta._Store;
import com.darwino.jsonstore.query.nodes.SpecialFieldNode;

/**
 * News Database Definition.
 * 
 * @author Philippe Riand
 */
public class NewsDatabaseDef extends DatabaseFactoryImpl {
	
	public static final String DATABASE_NEWS = "news";
	public static final String STORE_NEWS = "news";

	public static final int DATABASE_VERSION	= 1;
	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		return DATABASE_VERSION;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equals(databaseName, DATABASE_NEWS)) {
			return null;
		}
		_Database db = new _Database(DATABASE_NEWS, "News Database", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		//db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		db.setInstanceEnabled(true);

		// Store: NEWS
		{
			_Store store = db.addStore(STORE_NEWS);
			store.setLabel("News feed");
			store.setReadMarkEnabled(true);
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("title");

			_Index i1 = store.addIndex("byDate");
			i1.setLabel("News by date");
			i1.keys(SpecialFieldNode.LASTMODDATE);
			i1.valuesExtract("{title: 'title', category: 'category', source: 'source', content: {$abstract:{$path:'content'}}}");

			_Index i2 = store.addIndex("byCategory");
			i2.setLabel("categorize");
			i2.keys("category", SpecialFieldNode.LASTMODDATE);
			i2.valuesExtract("{title: 'title', category: 'category', source: 'source', content: {$abstract:{$path:'content'}}}");

			_Index i3 = store.addIndex("bySource");
			i3.setLabel("source");
			i3.keys("source", SpecialFieldNode.LASTMODDATE);
			i3.valuesExtract("{title: 'title', category: 'category', source: 'source', content: {$abstract:{$path:'content'}}}");
		}

		return db;
	}
}
