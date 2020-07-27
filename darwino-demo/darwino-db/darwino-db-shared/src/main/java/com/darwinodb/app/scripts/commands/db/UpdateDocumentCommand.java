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

import java.util.Iterator;

import com.darwino.commons.json.JsonFactory;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Update an existing document.
 */
@Command(name="update-document",description="Update a document in a database",mixinStandardHelpOptions = true)
public class UpdateDocumentCommand extends BaseStoreCommand {
	
//	@Option(names = {"--id"}, description = "Document ID")
//	public String id;

	@Option(names = {"-u","--unid"}, description = "Document UNID")
	public String unid;
	
	@Option(names = {"-j","--json"}, description = "JSON data for the document")
	public String json;
	
	@Option(names = {"--merge"}, description = "Merge this data withthe existing document")
	public boolean merge;

	public UpdateDocumentCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Store st = getStore();
		
		if(StringUtil.isEmpty(unid)) {
			throw new DSRuntimeException(null,"Missing UNID");
		}

		if(StringUtil.isEmpty(json)) {
			throw new DSRuntimeException(null,"Missing JSON data");
		}
		
		JsonFactory jf = getSession().getJsonFactory();
		Object data = jf.fromJson(json);
		
		Document doc = st.loadDocument(unid);
		if(merge) {
			if(!jf.isObject(data)) {
				throw new DSRuntimeException(null,"The JSON data has to be an object for merge");
			}
			if(!jf.isObject(doc.getJson())) {
				throw new DSRuntimeException(null,"The JSON document has to be an object for merge");
			}
			for( Iterator<String> it=jf.iterateObjectProperties(doc.getJson()); it.hasNext(); ) {
				String key = it.next();
				jf.setProperty(data, key, jf.getProperty(doc.getJson(), key));
			}
		}
		doc.setJson(data);
		doc.save();
		
		
		println("Document with UNID={0} has been sucessfully created",doc.getUnid());
		return 0;
	}
}
