/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.contacts.app.microservices;

import com.contacts.app.AppDatabaseDef;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.microservices.JsonMicroService;
import com.darwino.commons.microservices.JsonMicroServiceContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.platform.DarwinoContext;



/**
 * Set the size of a selection of compnies.
 */
public class SetCompanySize implements JsonMicroService {
	
	public static final String NAME = "SetCompanySize";
	
	@Override
	public void execute(JsonMicroServiceContext context) throws JsonException {
		JsonObject req = (JsonObject)context.getRequest();
		JsonArray sel = req.getArray("ids");
		if(sel==null || sel.isEmpty()) {
			context.throwError("The selection is empty");
		}
		int size = req.getInt("size");

		Session session = DarwinoContext.get().getSession();
		Store st = session.getDatabase(AppDatabaseDef.DATABASE_NAME).getStore(AppDatabaseDef.STORE_COMPANIES);
		
		session.startTransaction();
		try {
			for(int i=0; i<sel.size(); i++) {
				String unid = sel.getString(i);
				Document doc = st.loadDocument(unid);
				doc.set("size", size);
				doc.save();
			}
			session.commitTransaction();
		} finally {
			session.endTransaction();
		}
		
		context.setResponse(
			JsonObject.of("message",StringUtil.format("Updated {0} documents", sel.size()))
		);
	}
}
