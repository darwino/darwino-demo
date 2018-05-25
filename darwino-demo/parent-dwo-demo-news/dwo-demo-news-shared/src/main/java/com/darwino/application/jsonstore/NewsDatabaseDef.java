/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

package com.darwino.application.jsonstore;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._FieldPath;
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
		if(!StringUtil.equalsIgnoreCase(databaseName, DATABASE_NEWS)) {
			return -1;
		}
		return DATABASE_VERSION;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(!StringUtil.equalsIgnoreCase(databaseName, DATABASE_NEWS)) {
			return null;
		}
		_Database db = new _Database(DATABASE_NEWS, "News Database", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		//db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		db.setInstanceEnabled(true);
		
		{
			// We add an index to the comments store, as this is no longer defined in the default store
			// Note that indexes should be removed over time
			_Store store = db.getStore(Database.STORE_COMMENTS);
			try {
				store.addQueryField("date",_FieldPath.TYPE_TIMESTAMP, false);
				
				// THIS SHOULD BE REMOVED!
				// Register document events
				_Index i1 = store.addIndex("allComments");
				i1.setLabel("Comments by date");
				// Cannot do that because it fails the unit test comparison.
				// So we use a fake date field
				// i1.keys(SpecialFieldNode.LASTMODDATE);
				i1.addKey("date",_FieldPath.TYPE_TIMESTAMP);
				i1.valuesExtract("\"$\"");
			} catch(JsonException ex) {} // Should not happen
		}

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
