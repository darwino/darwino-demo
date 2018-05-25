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
 * Set the size of a selection of companies.
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
