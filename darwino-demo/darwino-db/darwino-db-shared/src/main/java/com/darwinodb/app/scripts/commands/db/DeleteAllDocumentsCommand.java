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

package com.darwinodb.app.scripts.commands.db;

import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Store;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Delete all documents.
 */
@Command(name="delete-all-documents",description="Delete all documents in a store or a database",mixinStandardHelpOptions = true)
public class DeleteAllDocumentsCommand extends BaseStoreCommand {
	
	@Option(names = {"--erase"}, description = "Erase the replication history for the documents")
	public boolean erase;

	public DeleteAllDocumentsCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		if(hasStore()) {
			Store st = getStore();
			st.deleteAllDocuments(erase ? Store.DELETE_ERASE : 0);
			println("Deleted all documents from database {0}, store {1}",database,store);
		} else {
			Database db = getDatabase();
			db.deleteAllDocuments(erase ? Database.DELETE_ERASE : 0);
			println("Deleted all documents from database {0}",database);
		}
		return 0;
	}
}
