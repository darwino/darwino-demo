/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.react.app;

import java.util.List;

import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.commons.services.rest.RestServiceFactory;
import com.darwino.commons.util.Lic;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoHttpConstants;


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
					o.put("name", "dwodemoreact");
					
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
					addAppInfo(context,o);
				} catch(Exception ex) {
					o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
				}
				context.emitJson(o);
			} else {
				throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
			}
		}
	}
	
	public class Properties extends HttpService {
		@Override
		public void service(HttpServiceContext context) {
			if(context.isGet()) {
				JsonObject o = new JsonObject();
				try {
					// Check if JSON query is supported by this DB driver
					o.put("jsonQuery", DarwinoApplication.get().getLocalJsonDBServer().isJsonQuerySupported());
										
					// Instances are only supported with the Enterprise edition
					o.put("useInstances", false);
					if(Lic.isEnterpriseEdition()) {
						Session session = DarwinoContext.get().getSession();
						String dbName = DarwinoApplication.get().getManifest().getMainDatabase();
						Database db = session.getDatabase(dbName);
						if(db.isInstanceEnabled()) {
							o.put("useInstances", true);
							// The instances can be fixed from a property or read from the database
							//JsonArray a = new JsonArray(session.getDatabaseInstances(dbName));
							JsonArray a = new JsonArray(AppDatabaseDef.getInstances());
							o.put("instances", a);
						}
					}
					
					// Add custom properties
					addProperties(context,o);
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
	
	protected void addAppInfo(HttpServiceContext context, JsonObject info) {
		// Add specific app information here..
	}
	
	protected void addProperties(HttpServiceContext context, JsonObject props) {
		// Add specific properties here...
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
		
		/////////////////////////////////////////////////////////////////////////////////
		// APPLICATION PROPERTIES
		binders.add(new RestServiceBinder("properties") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				return new Properties();
			}
		});
	}	
}
