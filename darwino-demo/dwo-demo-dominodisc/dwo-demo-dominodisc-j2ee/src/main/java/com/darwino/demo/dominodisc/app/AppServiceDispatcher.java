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
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.demo.dominodisc.demodata.ForumDataReader;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.j2ee.application.DarwinoJ2EEServiceDispatcherFilter;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.sql.impl.full.LocalFullJsonDBServerImpl;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platforms.ApplicationEnvironment;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class AppServiceDispatcher extends DarwinoJ2EEServiceDispatcherFilter {
	
	public AppServiceDispatcher() {
	}
	
// Here is some code sample for services customization
// You can uncomment what is need by your application
//	
//	/**
//	 * Init and customize the application services. 
//	 */
//	@Override
//	protected void initServicesFactories(FilterConfig config, HttpServiceFactories factories) {
//		super.initServicesFactories(config, factories);
//		
//		// Here is how to install a service manager, to control:
//		//   - Access the services (security), for example based on the caller
//		//	 - Manage stats about the services - count the successful calls to an API and manage quotas
//		HttpServiceManager serviceManager = new HttpServiceManager() {
//			@Override
//			public void preExecute(HttpServiceContext context, HttpServiceFactory factory, HttpService service) {
//			}
//			@Override
//			public void postExecute(HttpServiceContext context, HttpServiceFactory factory, HttpService service) {
//			}
//		};
//		factories.setServiceManager(serviceManager);
//		
//		//
//		// Here is how to install a JSON document content filter 
//		// 
//		JsonStoreServiceFactory jsonStoreFactory = factories.getFactory(JsonStoreServiceFactory.class);
//		jsonStoreFactory.setDocumentContentFilter(new DocumentContentFilter() {
//			@Override
//			public void filter(Document doc) throws JsonException {
//				// You can filter here the JSON stored in the doc before it is sent to the client
//			}
//			@Override
//			public void update(Document doc, Object json) throws JsonException {
//				// You can merge the actual content document with the one sent by the service
//				// Default is to replace the existing content
//				doc.updateJson(json);
//			}
//		});
//	}
	
	/**
	 * Add the application specific services. 
	 */
	@Override
	protected void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The service should always executed locally when running on a server
		factories.add(new AppServiceFactory() {
			@Override
			protected void addAppInfo(JsonObject o) {
				// Application environment
				{
					ApplicationEnvironment appenv = DarwinoJ2EEApplication.get().getApplicationEnvironment();
					JsonObject env = new JsonObject();
					env.put("cloud", appenv.isCloud());
					env.put("runtime", appenv.toString());
					o.put("environment", env);
				}
				
				// Database type
				{
					LocalFullJsonDBServerImpl srv = DarwinoJ2EEApplication.get().getLocalJsonDBServer();
					JsonObject db = new JsonObject();
					db.put("driver", srv.getSqlContext().getDbDriver().getDatabaseType().toString());
					db.put("path", srv.getSqlContext().getConnectionId());
					o.put("database", db);
				}
			}
			@Override
			protected void createServicesBinders(List<RestServiceBinder> binders) {
				super.createServicesBinders(binders);

				binders.add(new RestServiceBinder(".reset-forum") {
					@Override
					public HttpService createService(HttpServiceContext context, String[] parts) {
						return new ResetForum();
					}
				});
			}
		});
	}

	public static class ForumTask extends Task<Void> {
		private String instance;
		private int count;
		public ForumTask(String instance, int count) {
			this.instance = instance;
			this.count = count;
		}
		@Override
		public Void execute(TaskExecutorContext context) throws TaskException {
			// We must run a system session to be able to delete the documents with author fields
			try {
				Session session = DarwinoApplication.get().getLocalJsonDBServer().createSystemSession(instance);
				try {
					ForumDataReader dr = new ForumDataReader(ForumDataReader.PINBALL_FORUM);
					Database db = session.getDatabase(AppDatabaseDef.DATABASE_NAME);
					Store st = db.getStore(AppDatabaseDef.STORE_NSFDATA);
					db.deleteAllDocuments(Store.DELETE_ERASE);
					dr.extract(st, count);
				} finally {
					StreamUtil.close(session);
					session = null;
				}
			} catch(JsonException ex) {
				Platform.log(ex);
			}
			return null;
		}
	}
	public class ResetForum extends HttpService {
		@Override
		public void service(HttpServiceContext context) {
			if(context.isGet()) {
				String instance=null;
				if(context.hasQueryParameter("instance")) {
					instance = context.getQueryParameterString("instance");
				} else {
					String[] inst = AppDatabaseDef.getInstances();
					if(inst!=null && inst.length>0) {
						instance = inst[0];
					}
				}
				int count = context.getQueryParameterInt("count");
				if(count<=0) {
					count = 32;
				}
				
				// Execute as background
				TaskExecutorService svc = Platform.getService(TaskExecutorService.class);
				TaskExecutor<Void> ex = svc.createExecutor(true);
				ex.exec(new ForumTask(instance,count),null,null,null);
				
				try {
					context.emitJson(JsonObject.fromJson("{message: 'Forum import started'}"));
				} catch(JsonException e) {Platform.log(e);}
			} else {
				throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
			}
		}
	}
	
}
