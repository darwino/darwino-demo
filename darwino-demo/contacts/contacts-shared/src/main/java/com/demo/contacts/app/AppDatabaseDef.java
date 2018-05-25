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

package com.demo.contacts.app;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.impl.DatabaseFactoryImpl;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._DatabaseACL;
import com.darwino.jsonstore.meta._FtSearch;
import com.darwino.jsonstore.meta._Store;

/**
 * Database Definition.
 * 
 * @author Philippe Riand
 */
public class AppDatabaseDef extends DatabaseFactoryImpl {

	// V2: added FT search
	// V3: used store
	// V4: back to default store for contacts
	// V5: added company document store
	// V6: added ACL for the demo user
	public static final int DATABASE_VERSION	= 6;
	public static final String DATABASE_NAME	= "contacts";
	//public static final String DATABASE_NAME	= "contactslg";
	
	public static final String STORE_COMPANIES	= "companies";
	
    public static final String[] DATABASES = new String[] {
    	DATABASE_NAME
    };
	
	// The list  of instances is defined through a property for the DB
	public static String[] getInstances() {
		//JsonArray a = new JsonArray(session.getDatabaseInstances(dbName));
		String inst = Platform.getProperty("contacts.instances");
		if(StringUtil.isNotEmpty(inst)) {
			return StringUtil.splitString(inst, ',', true);
		}
		return null;
	}	

	@Override
    public String[] getDatabases() throws JsonException {
		return DATABASES;
	}
	
	@Override
	public int getDatabaseVersion(String databaseName) throws JsonException {
		if(StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return DATABASE_VERSION;
		}
		return -1;
	}
	
	@Override
	public _Database loadDatabase(String databaseName) throws JsonException {
		if(StringUtil.equalsIgnoreCase(databaseName, DATABASE_NAME)) {
			return loadDatabase_contacts();
		}
		return null;
	}
	
	public _Database loadDatabase_contacts() throws JsonException {
		_Database db = new _Database(DATABASE_NAME, "Contacts", DATABASE_VERSION);

		db.setReplicationEnabled(true);
		
		// Document base security
		// db.setDocumentSecurity(Database.DOCSEC_INCLUDE);
		_DatabaseACL acl = new _DatabaseACL();
		acl.addUser("demo", _DatabaseACL.ROLE_READER);
		acl.addAuthenticated(_DatabaseACL.ROLE_FULLEDITOR);
		db.setACL(acl);
		
		// Customize the default stores, if desired...
		// This store actually stores the contacts
		{
			_Store _def = db.getStore(Database.STORE_DEFAULT);
			_def.setFtSearchEnabled(true);
			_FtSearch ft = (_FtSearch) _def.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}

		// Other stores...
		{
			_Store store = db.addStore(STORE_COMPANIES);
			store.setLabel("Companies");
			store.setFtSearchEnabled(true);
			
			// Search the whole document (all fields)
			_FtSearch ft = (_FtSearch) store.setFTSearch(new _FtSearch());
			ft.setFields("$");
		}
		{
			_Store store = db.addStore("companydocs");
			store.setLabel("Company documents");
		}

		return db;
	}
}
