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

package com.darwino.demo.dominodisc.app;

import java.util.List;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.commons.services.rest.RestServiceFactory;
import com.darwino.commons.util.Lic;
import com.darwino.demo.dominodisc.service.RedirService;
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
					o.put("name", "discdb");
					
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
					
					// Debug plugin is always supported unless the property is overridden by addProperties()
					o.put("debugPlugin", true);
										
					// Instances are only supported with the Enterprise edition
					o.put("useInstances", false);
					if(Lic.isEnterpriseEdition()) {
						Session session = DarwinoContext.get().getSession();
						String dbName = DarwinoApplication.get().getManifest().getMainDatabase();
						Database db = session.getDatabase(dbName);
						if(db.isInstanceEnabled()) {
							o.put("useInstances", true);
							// The instances can be fixed from a property or read from the database
							JsonArray a = new JsonArray(AppDatabaseDef.getInstances());
							o.put("instances", a);
						}
					}
					
					// Watson services
					o.put("localized", Platform.getProperty("discdb.watson.translate"));
					o.put("toneanalyzer", Platform.getProperty("discdb.watson.toneanalyzer"));
					
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
		
		binders.add(new RestServiceBinder("homeredir") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				return new RedirService();
			}
		});
	}	
}
