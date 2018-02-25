/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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

package com.contacts.app.services;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.DarwinoContext;

import com.contacts.app.AppManifest;


/**
 * Simple app information REST service.
 * 
 * @author Philippe Riand
 */
public class AppInformationRest extends HttpService {
	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
			JsonObject o = new JsonObject();
			try {
				o.put("name", "contacts");
				
				// Access to the app manifest
				AppManifest mf = (AppManifest)DarwinoApplication.get().getManifest();
				o.put("application", DarwinoApplication.get().toString() );
				o.put("label", mf.getLabel());
				o.put("description", mf.getDescription());
				
				// Access to the database session
				JsonObject jSession = new JsonObject();
				Session session = DarwinoContext.get().getSession();
				jSession.put("user", session.getUser().getDn());
				jSession.put("instanceId", session.getInstanceId());
				o.put("session", jSession);
				
				// Add custom application information
			} catch(Exception ex) {
				o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
			}
		context.emitJson(o);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}
}
