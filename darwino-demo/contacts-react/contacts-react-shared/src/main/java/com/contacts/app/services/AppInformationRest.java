/*!COPYRIGHT HEADER! 
 *
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
				// ....
				
		} catch(Exception ex) {
				o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
			}
			context.emitJson(o);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}
}
