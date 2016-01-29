/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
		db.setInstanceEnabled(true);

		// Store: PINBALLS
		{
			_Store store = db.addStore(STORE_PINBALLS);
			store.setLabel("Pinball list");

			store.addQueryField("manufacturer", JsonUtil.TYPE_STRING, false)
			 	 .addQueryField("released", JsonUtil.TYPE_NUMBER, false)
			 	 .addQueryField("name", JsonUtil.TYPE_STRING, false);
		}

		// Store: PINBALL OWNERS
		{
			_Store store = db.addStore(STORE_PINBALLOWNER);
			store.setLabel("Pinball owners");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("city", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}

		// Store: PINBALL OWNERS BIG
		{
			_Store store = db.addStore(STORE_PINBALLOWNERB);
			store.setLabel("Pinball owners - big");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("city", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
		 	 	.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}


		// Store: PINBALL OWNERS BIGGER
		{
			_Store store = db.addStore(STORE_PINBALLOWNERBG);
			store.setLabel("Pinball owners - bigger");

			store.addQueryField("state", JsonUtil.TYPE_STRING, false)
				.addQueryField("city", JsonUtil.TYPE_STRING, false)
				.addQueryField("firstName", JsonUtil.TYPE_STRING, false)
				.addQueryField("lastName", JsonUtil.TYPE_STRING, false);
		}
		

		// Store: FORUM
		{
			_Store store = db.addStore(STORE_FORUM);
			store.setLabel("Forum");
			store.setTaggingEnabled(true);
			store.setReadMarkEnabled(true);
			store.setAnonymousSocial(true);
			store.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("title");

			store.addQueryField("title", JsonUtil.TYPE_STRING, false)
				.addQueryField("author", JsonUtil.TYPE_STRING, false)
				.addQueryField("category", JsonUtil.TYPE_STRING, false);

			_Index i1 = store.addIndex("byCategory");
			i1.setLabel("By Category");
			i1.keys("category");
			i1.valuesExtract("{title: 'title', category: 'category', author: 'author'}");
			i1.addQueryField("title", JsonUtil.TYPE_STRING, false)
			  .addQueryField("author", JsonUtil.TYPE_STRING, false)
			  .addQueryField("category", JsonUtil.TYPE_STRING, false);

			_Index i2 = store.addIndex("byCategoryDate");
			i2.setLabel("By Category And Creation Date");
			i2.keys("category", SpecialFieldNode.CREATEDATE);
			i2.valuesExtract("{title: 'title', category: 'category', author: 'author'}");
			i2.addQueryField("title", JsonUtil.TYPE_STRING, false)
			  .addQueryField("author", JsonUtil.TYPE_STRING, false)
			  .addQueryField("category", JsonUtil.TYPE_STRING, false);

			_Index i3 = store.addIndex("byCategoryContent");
			i3.setLabel("By Category with Content");
			i3.keys("category");
			i3.valuesExtract("{title: 'title', category: 'category', author: 'author', content: {$abstract:{$path:'content'}}}");
			i3.addQueryField("title", JsonUtil.TYPE_STRING, false)
			  .addQueryField("author", JsonUtil.TYPE_STRING, false)
			  .addQueryField("category", JsonUtil.TYPE_STRING, false);

			_Index i4 = store.addIndex("byCategoryAuthorDate");
			i4.setLabel("By Category, Author, CreationDate");
			i4.keys("category", "author", SpecialFieldNode.CREATEDATE);
			i4.valuesExtract("{title: 'title', category: 'category', author: 'author'}");
			i4.addQueryField("title", JsonUtil.TYPE_STRING, false)
			  .addQueryField("author", JsonUtil.TYPE_STRING, false)
			  .addQueryField("category", JsonUtil.TYPE_STRING, false);
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
