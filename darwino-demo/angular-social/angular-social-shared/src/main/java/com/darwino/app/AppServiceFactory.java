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

package com.darwino.app;

import java.util.List;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.commons.services.rest.RestServiceFactory;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoHttpConstants;
import com.darwino.services.rest.ResourcesRest;


/**
 * Application Service Factory.
 * 
 * This is the place where to define custom application services.
 * 
 * @author Philippe Riand
 */
public class AppServiceFactory extends RestServiceFactory {
	
	public class AppInformation extends HttpService {
		@Override
		public void service(HttpServiceContext context) {
			if(context.isGet()) {
				JsonObject o = new JsonObject();
				try {
					o.put("name", "ngsocial");
					
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
				} catch(Exception ex) {
					o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
				}
				context.emitJson(o);
			} else {
				throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
			}
		}
	}
	
	public AppServiceFactory() {
		super(DarwinoHttpConstants.APPSERVICES_PATH);
	}
	
	@Override
	protected void createServicesBinders(List<RestServiceBinder> binders) {
		/////////////////////////////////////////////////////////////////////////////////
		// INFORMATION
		binders.add(new RestServiceBinder() {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				return new AppInformation();
			}
		});
		
		binders.add(new RestServiceBinder("resources") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				return new ResourcesRest();
			}
		});
		binders.add(new RestServiceBinder("resources", null) {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				return new ResourcesRest(parts[1]);
			}
		});

	}	
}
