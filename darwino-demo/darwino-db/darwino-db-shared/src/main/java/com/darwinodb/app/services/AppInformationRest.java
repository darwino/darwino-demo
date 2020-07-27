/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.services;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.security.acl.User;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.DarwinoContext;

import com.darwinodb.app.AppManifest;


/**
 * Simple app information REST service.
 */
public class AppInformationRest extends HttpService {
	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
			JsonObject o = new JsonObject.LinkedMap();
			try {
				o.put("name", "darwinodb");
				
				// Access to the app manifest
				AppManifest mf = (AppManifest)DarwinoApplication.get().getManifest();
				o.put("application", DarwinoApplication.get().toString() );
				o.put("label", mf.getLabel());
				o.put("description", mf.getDescription());
				
				// Access the current user 
				JsonObject jUser = new JsonObject.LinkedMap();
				User user = DarwinoContext.get().getUser();
				jUser.put("dn", user.getDn());
				jUser.put("cn", user.getCn());
				jUser.put("groups", new JsonArray(user.getGroups()));
				jUser.put("roles", new JsonArray(user.getRoles()));
				o.put("user", jUser);
				
				// Access to the database session
				JsonObject jSession = new JsonObject.LinkedMap();
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
