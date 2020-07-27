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

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.MutableInt;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.callback.DocumentHandler;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * List documents.
 */
@Command(name="list-documents",description="List documents in a store or a database",mixinStandardHelpOptions = true)
public class ListDocumentsCommand extends BaseCursorCommand {
	
	@Option(names = {"--skip"}, description = "Number of documents to skip")
	public int skip;
	
	@Option(names = {"--limit"}, description = "Maximum number of documents to query (default=10)")
	public int limit = 10;

	@Option(names = {"-e","--extraction"}, description = "Extraction")
	public String extraction;

	@Option(names = {"-o","--orderby"}, description = "Order By")
	public String orderBy;

	public ListDocumentsCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Cursor cursor = createCursor();
		cursor.range(skip, limit);
		
		if(StringUtil.isNotEmpty(extraction)) {
			cursor.extract(extraction);
		}
		
		if(StringUtil.isNotEmpty(orderBy)) {
			cursor.orderBy(StringUtil.splitString(orderBy, ',', true));
		}
		
		MutableInt count = new MutableInt(0);

		cursor.findDocuments(new DocumentHandler() {			
			@Override
			public boolean handle(Document document) throws JsonException {
				count.add(1);
				StringBuilder b = new StringBuilder();
				b.append("#");
				b.append(count);
				b.append(": ");
				if(StringUtil.isNotEmpty(extraction)) {
					b.append(document.getJson());
					
				} else {
					b.append("UNID: ");
					b.append(document.getUnid());
					b.append("\n");
					b.append(document.getJson());
				}
				println("{0}", b);
				return true;
			}
		});
		
		println("Listed {0} document(s) from database {1}",count,database);

		return 0;
	}
}
