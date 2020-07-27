/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwinodb.app.scripts.commands;

import com.darwino.commons.util.QuickSort;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.script.DSRuntimeException;

import picocli.CommandLine.Option;

/**
 * Count documents in a store command.
 */
public abstract class BaseDatabaseCommand extends AbstractCommand {
	
	@Option(names = {"-d", "--database"}, description = "Database id")
	public String database;
	
//	@Option(names = {"-i", "--instance"}, description = "Instance id")
//	public String instance;

	public BaseDatabaseCommand() {
	}
	
	public Session getSession() {
		return getContext().getSession();
	}
	
	public boolean hasDatabase() {
		return StringUtil.isNotEmpty(database);
	}
	public void checkDatabase() throws Exception {
		if(!hasDatabase()) {
			throw new DSRuntimeException(null,"Missing database id");
		}
	}
	public Database getDatabase() throws Exception {
		checkDatabase();
		Session session = getSession();
		if(!session.databaseExists(database)) {
			throw new DSRuntimeException(null,"The database {0} does not exist",database) ;
		}
		Database db = session.getDatabase(database);
		return db;
	}
	
	public void listStores() throws Exception {
		Database db = getDatabase();
		String[] stores = db.getStoreList();
		new QuickSort.StringArray(stores);
		println("List of stores, database {0}",database,stores.length);
		for(int i=0; i<stores.length; i++) {
			println("    {0} [{1}]", stores[i], db.getStore(stores[i]).documentCount());
		}
	}
}
