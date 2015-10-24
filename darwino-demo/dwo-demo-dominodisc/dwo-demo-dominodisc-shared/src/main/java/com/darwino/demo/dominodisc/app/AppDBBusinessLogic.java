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

package com.darwino.demo.dominodisc.app;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.security.acl.User;
import com.darwino.commons.security.acl.UserException;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.text.HtmlTextUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.extensions.DefaultExtensionRegistry;
import com.darwino.jsonstore.extensions.DocumentEvents;
import com.darwino.platform.DarwinoContext;

/**
 * Database Business logic - event handlers.
 * 
 * @author Philippe Riand
 */
public  class AppDBBusinessLogic extends DefaultExtensionRegistry {
	
	public AppDBBusinessLogic() {
		registerDocumentEvents(AppDatabaseDef.DATABASE_NAME, AppDatabaseDef.STORE_NSFDATA, new DocumentEvents() {
			@Override
			public void querySaveDocument(Document doc) throws JsonException {
				// Make sure that all the fields are added
				if(!(doc.getJson() instanceof JsonObject)) {
					throw new JsonException(null,"JSON data is not an object");
				}
				JsonObject json = (JsonObject)doc.getJson();
		
				// Add the user who created the entry
				// we use the email as the ID here, as this is the one understood by Connections profiles
				try {
					DarwinoContext ctx = DarwinoContext.get();
					User user = ctx.getUser();
					json.putStringDef("from",user.getDn());
					json.putStringDef("altfrom",(String)user.getAttribute(User.ATTR_EMAIL));
					json.putStringDef("abbreviatefrom",user.getCn()); // Not sure about this
					json.putStringDef("abrfrom",user.getCn()); // Not sure about this
		
					// Calculate the abstract
					String body = json.getString("body");
					if(StringUtil.isNotEmpty(body)) {
						String abs = HtmlTextUtil.fromHTML(body,300); // 300 matches the LotusScript one
						json.putStringDef("abstract",abs);
					} else {
						json.remove("abstract");
					}
				} catch(UserException ex) {
					throw new JsonException(ex);
				}
			}
		});
	}
}
