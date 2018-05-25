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

package com.darwino.demo.dominodisc.app;

import com.darwino.commons.Platform;
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

	public static final int DATABASE_VERSION	= 5;

	public static final String STORE_NSFDATA       = "nsfdata"; //$NON-NLS-1$
	public static final String STORE_NSFDATA_FR    = "nsfdata_fr"; //$NON-NLS-1$
	public static final String STORE_NSFDATA_ES    = "nsfdata_es"; //$NON-NLS-1$
	public static final String STORE_ANALYZE 	   = "analyze"; //$NON-NLS-1$
	public static final String STORE_CONFIG        = "config"; //$NON-NLS-1$

	public static final String DATABASE_NAME       = "domdisc"; //$NON-NLS-1$

	// The list  of instances is defined through a property for the DB
	public static String[] getInstances() {
		//JsonArray a = new JsonArray(session.getDatabaseInstances(dbName));
		String inst = Platform.getProperty("discdb.instances");
		if(StringUtil.isNotEmpty(inst)) {
			return StringUtil.splitString(inst, ',', true);
		}
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
		_Database db = new _Database(DATABASE_NAME, "Domino Discussion", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		// We need security for writing the documents but not for reading
		// Adding DOCSEC_NOREADER makes the queries faster.
		db.setDocumentSecurity(Database.DOCSEC_INCLUDE|Database.DOCSEC_NOREADER|Database.DOCSEC_NOTESLIKE);
		db.setInstanceEnabled(true);

		// Store: NSF data
		{
			_Store store = db.addStore(STORE_NSFDATA);
			store.setLabel("NSF Data");
			store.setFtSearchEnabled(true);
			_FtSearch ft = store.setFTSearch(new _FtSearch());
			ft.setFields("$"); //$NON-NLS-1$

			store.addQueryField("form", JsonUtil.TYPE_STRING, false); //$NON-NLS-1$
			store.addQueryField("author", JsonUtil.TYPE_STRING, false, "$._writers.from"); //$NON-NLS-1$
		}
		
		// Store: NSF French
		{
			// Added in version 4
			_Store store = db.addStore(STORE_NSFDATA_FR);
			store.setLabel("French Translation");
		}
		
		// Store: NSF Spanish
		{
			// Added in version 4
			_Store store = db.addStore(STORE_NSFDATA_ES);
			store.setLabel("Spanish Translation");
		}
		
		// Store: Content Analyzer
		{
			// Added in version 5
			_Store store = db.addStore(STORE_ANALYZE);
			store.setLabel("Analyzed Content");
		}
		
		// Store: Configuration
		{
			_Store store = db.addStore(STORE_CONFIG);
			store.setLabel("Configuration");
			store.setFtSearchEnabled(true);
			
			store.addQueryField("form", JsonUtil.TYPE_STRING, false); //$NON-NLS-1$
		}

		return db;
	}
}
