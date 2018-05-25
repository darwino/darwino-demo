/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
import com.darwino.jsonstore.helpers.SecurityHelper;

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
					if(doc.isNewDocument()) {
						User user = doc.getSession().getUser();
						SecurityHelper sec = new SecurityHelper(doc);
						if(sec.getWritersCount()==0) { // in case it was already added (import forums)
							sec.addWriter("from",user.getDn());
						}
						if(sec.getReadersCount()==0) { // in case it was already added (import forums)
							sec.addReader("_allReaders","*");
						}
	
						//json.putArray("from", JsonArray.valueOf(user.getDn()));
						json.putStringDef("altfrom",(String)user.getAttribute(User.ATTR_EMAIL));
						json.putStringDef("abbreviatefrom",user.getCn()); // Not sure about this
						json.putStringDef("abrfrom",user.getCn()); // Not sure about this
					}
		
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
