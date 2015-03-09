/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
 */

package com.darwino.demo.dominodisc;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.security.acl.User;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.extensions.DocumentEvents;
import com.darwino.platform.DarwinoContext;

/**
 * Discussion database data business logic.
 * 
 * @author Philippe Riand
 */
public  class DiscDbBusinessLogic extends DefaultExtensionRegistry {
	
	public DiscDbBusinessLogic() {
		registerDocumentEvents(DiscDbDatabaseDef.DATABASE_DOMDISC, DiscDbDatabaseDef.STORE_NSFDATA, new DocumentEvents() {
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				// Make sure that all the fields are added
				if(!(doc.getJson() instanceof JsonObject)) {
					throw new JsonException(null,"JSON data is not an object");
				}
				JsonObject json = (JsonObject)doc.getJson();

				// Add the user who created the entry
				// we use the email as the ID here, as this is the one understood by Connections profiles
				DarwinoContext ctx = DarwinoContext.get();
				String userName = ctx.getUser().getAttribute(User.ATTR_EMAIL);
				json.putString("from",userName);
				json.putString("altfrom",userName);
				json.putString("abbreviatefrom",ctx.getUser().getCommonName()); // Not sure about this
				json.putString("abrfrom",ctx.getUser().getCommonName()); // Not sure about this
				
				// Calculate the abstract
				String body = json.getString("body");
				if(StringUtil.isNotEmpty(body)) {
					json.putString("abstract",body.length()>30 ? body.substring(0,30)+"..." : body);
				} else {
					json.remove("abstract");
				}
			}
		});
	}
}
