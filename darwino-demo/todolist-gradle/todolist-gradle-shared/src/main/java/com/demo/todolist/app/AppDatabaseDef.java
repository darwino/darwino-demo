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
