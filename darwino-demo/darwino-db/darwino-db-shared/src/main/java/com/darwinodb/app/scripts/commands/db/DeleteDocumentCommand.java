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

import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Store;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Delete an existing document.
 */
@Command(name="delete-document",description="Delete a document in a database",mixinStandardHelpOptions = true)
public class DeleteDocumentCommand extends BaseStoreCommand {
	
//	@Option(names = {"--id"}, description = "Document ID")
//	public String id;

	@Option(names = {"-u","--unid"}, description = "Document UNID")
	public String unid;

	public DeleteDocumentCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Store st = getStore();
		
		if(StringUtil.isEmpty(unid)) {
			throw new DSRuntimeException(null,"Missing UNID");
		}

		st.deleteDocument(unid);
		
		
		println("Document with UNID={0} has been sucessfully deleted",unid);
		return 0;
	}
}
