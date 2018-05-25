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

package com.demo.todolist.app;

import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.j2ee.application.DarwinoJ2EEServiceDispatcherFilter;

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
		factories.add(new AppServiceFactory());
	}
}
