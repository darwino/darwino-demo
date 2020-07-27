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

import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Store;
import com.darwino.script.DSRuntimeException;

import picocli.CommandLine.Option;

/**
 * Count documents in a store command.
 */
public abstract class BaseStoreCommand extends BaseDatabaseCommand {
	
	@Option(names = {"-s", "--store"}, description = "Store id")
	public String store;

	public BaseStoreCommand() {
	}
	
	public boolean hasStore() {
		return StringUtil.isNotEmpty(store);
	}
	public void checkStore() throws Exception {
		if(!hasStore()) {
			throw new DSRuntimeException(null,"Missing store id");
		}
	}
	public Store getStore() throws Exception {
		checkStore();
		Database db = getDatabase();
		if(!db.storeExists(store)) {
			throw new DSRuntimeException(null,"The store {0} does not exist in database {1}",store,database);
		}
		return db.getStore(store);
	}
}
