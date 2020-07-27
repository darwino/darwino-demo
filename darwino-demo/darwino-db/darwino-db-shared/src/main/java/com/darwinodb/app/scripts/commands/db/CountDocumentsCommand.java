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

import com.darwino.jsonstore.Cursor;

import picocli.CommandLine.Command;

/**
 * Count documents in a store command.
 */
@Command(name="count-documents",description="Count the # of document in a store or a database",mixinStandardHelpOptions = true)
public class CountDocumentsCommand extends BaseCursorCommand {
	
	public CountDocumentsCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Cursor cursor = createCursor();
		int count = cursor.count();

		println("Document count={0}",count);
		return 0;
	}
}
