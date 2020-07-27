/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.j2ee.application.DarwinoJ2EEServiceDispatcherFilter;
import com.darwino.j2ee.services.jstore.J2EEServletJsonStoreServiceFactory;
import com.darwino.platform.DarwinoHttpConstants;

/**
 * J2EE application.
 */
public class AppServiceDispatcher extends DarwinoJ2EEServiceDispatcherFilter {
	
	// This dispatcher can be customized!
	public AppServiceDispatcher() {
	}
	
// Here is some code sample for services customization
// You can uncomment what is need by your application
//	
//	/**
//	 * Init and customize the application services. 
//	 */
//	@Override
//	protected void initServicesFactories(HttpServiceFactories factories) {
//		super.initServicesFactories(factories);
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
	 * Add a custom JSON store service factory. 
	 */
	@Override
	protected void addJsonStoreServiceFactories(HttpServiceFactories factories) {
		factories.add(new J2EEServletJsonStoreServiceFactory(DarwinoHttpConstants.JSONSTORE_PATH) {
			@Override
			public AccessControl createDefaultAccessControl() {
				// No access control for -> all Databases are authorized
				return null;
			}
		});
	}
	
	/**
	 * Add the application specific services. 
	 */
	@Override
	protected void addApplicationServiceFactories(HttpServiceFactories factories) {
		// Add the debug services
//		final DebugRestFactory debug = new DebugRestFactory();  
//		factories.add(debug);
	}
}
