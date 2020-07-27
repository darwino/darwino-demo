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

import com.darwino.commons.json.JsonFactory;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Create new document.
 */
@Command(name="create-document",description="Create a new document in a database",mixinStandardHelpOptions = true)
public class CreateDocumentCommand extends BaseStoreCommand {
	
	@Option(names = {"-u","--unid"}, description = "Document UNID - A GUID will be generated if missing")
	public String unid;
	
	@Option(names = {"-j","--json"}, description = "JSON data for the document")
	public String json;

	public CreateDocumentCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Store st = getStore();
		
		if(StringUtil.isEmpty(json)) {
			throw new DSRuntimeException(null,"Missing JSON data");
		}
		
		JsonFactory jf = getSession().getJsonFactory();
		Object data = jf.fromJson(json);
		
		Document doc = st.newDocument(unid);
		doc.setJson(data);
		doc.save();
		
		
		println("Document with UNID={0} has been sucessfully created",doc.getUnid());
		return 0;
	}
}
