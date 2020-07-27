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
import com.darwino.jsonstore.Cursor;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Option;

/**
 * Base abstract cursor command.
 */
public abstract class BaseCursorCommand extends BaseStoreCommand {
	
	@Option(names = {"--unid"}, description = "Document UNID")
	public String unid;

	@Option(names = {"-q","--query"}, description = "Document query")
	public String query;

	@Option(names = {"--ftsearch"}, description = "Full text search")
	public String ftsearch;

	public BaseCursorCommand() {
	}
	
	public Cursor createCursor() throws Exception {
		Cursor cursor = hasStore() ? getStore().openCursor() : getDatabase().openCursor();
		
		if(StringUtil.isNotEmpty(unid)) {
			cursor.unid(unid);
		}
		
		if(StringUtil.isNotEmpty(query)) {
			cursor.query(query);
		}
		
		if(StringUtil.isNotEmpty(ftsearch)) {
			cursor.ftSearch(ftsearch);
		}
		
		return cursor;
	}
}
