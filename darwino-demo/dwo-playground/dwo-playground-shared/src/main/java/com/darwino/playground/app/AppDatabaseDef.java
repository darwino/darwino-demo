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

package com.darwino.playground.app;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Index;
import com.darwino.jsonstore.meta._Store;
import com.darwino.jsonstore.query.nodes.SpecialFieldNode;

/**
 * Database Definition.
 * 
 * @author Philippe Riand
 */
public class AppDatabaseDef extends DatabaseFactoryImpl {

	public static final String DATABASE_NAME	= "playground";
	public static final int DATABASE_VERSION	= 1;
	
	public static final String STORE_PINBALLS = "pinball";
	public static final String STORE_FORUM = "forum";
	public static final String STORE_PINBALLOWNER = "owners";
	public static final String STORE_PINBALLOWNERB = "owners-big";
	public static final String STORE_PINBALLOWNERBG = "owners-bigger";
	
	public static final String STORE_TEMPDOC  = "temp";
	public static final String STORE_TEMPDOC1 = "temp1";
	public static final String STORE_TEMPDOC2 = "temp2";
	public static final String STORE_TEMPSOC  = "tempsocial";

	public AppDatabaseDef() {
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
		_Database db = new _Database(DATABASE_NAME, "Playground Database", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		//db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		db.setInstanceEnabled(false);

		// Store: PINBALLS
		{
			_Store store = db.addStore(STORE_PINBALLS);
			store.setLabel("Pinball list");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");

			store.addQueryField("manufacturer", JsonUtil.TYPE_STRING, false)
			 	 .addQueryField("released", JsonUtil.TYPE_NUMBER, false)
			 	 .addQueryField("name", JsonUtil.TYPE_STRING, false);
		}

		// Store: PINBALL OWNERS
		{
			_Store store = db.addStore(STORE_PINBALLOWNER);
			store.setLabel("Pinball owners");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("city", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}

		// Store: PINBALL OWNERS BIG
		{
			_Store store = db.addStore(STORE_PINBALLOWNERB);
			store.setLabel("Pinball owners - big");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("city", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}


		// Store: PINBALL OWNERS BIGGER
		{
			_Store store = db.addStore(STORE_PINBALLOWNERBG);
			store.setLabel("Pinball owners - bigger");
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
				.addQueryField("city", JsonUtil.TYPE_STRING, false)
				.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
				.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}
		

		// Store: FORUM
		{
			_Store store = db.addStore(STORE_FORUM);
			store.setLabel("Forum");
			store.setReadMarkEnabled(true);
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("title");

			store.addQueryField("title", JsonUtil.TYPE_STRING, false)
				.addQueryField("author", JsonUtil.TYPE_STRING, false)
				.addQueryField("category", JsonUtil.TYPE_STRING, false);

			_Index i1 = store.addIndex("byDate");
			i1.setLabel("News by date");
			i1.keys(SpecialFieldNode.LASTMODDATE);
			i1.valuesExtract("{title: 'title', category: 'category', author: 'author', content: {$abstract:{$path:'content'}}}");

			_Index i2 = store.addIndex("byCategory");
			i2.setLabel("categorize");
			i2.keys("category", SpecialFieldNode.LASTMODDATE);
			i2.valuesExtract("{title: 'title', category: 'category', author: 'author', content: {$abstract:{$path:'content'}}}");

			_Index i3 = store.addIndex("byAuthor");
			i3.setLabel("author");
			i3.keys("author", SpecialFieldNode.LASTMODDATE);
			i3.valuesExtract("{title: 'title', category: 'category', author: 'author', content: {$abstract:{$path:'content'}}}");
		}
		

		// Stores: Temp Documents
		{
			_Store store = db.addStore(STORE_TEMPDOC);
			store.setLabel("Temporary Documents");
		}
		{
			_Store store = db.addStore(STORE_TEMPDOC1);
			store.setLabel("Temporary Documents #1");
		}
		{
			_Store store = db.addStore(STORE_TEMPDOC2);
			store.setLabel("Temporary Documents #2");
		}
		{
			_Store store = db.addStore(STORE_TEMPSOC);
			store.setLabel("Temporary Documents With All Social Attributes");
			store.setTaggingEnabled(true);
			store.setReadMarkEnabled(true);
			store.setAnonymousSocial(true);
		}
		
		return db;
	}
}
