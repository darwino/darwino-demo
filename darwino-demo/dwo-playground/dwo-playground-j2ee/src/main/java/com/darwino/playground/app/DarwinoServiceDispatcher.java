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

package com.darwino.playground.app;

import java.util.List;

import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.j2ee.application.DarwinoJ2EEServiceDispatcherFilter;
import com.darwino.playground.app.services.ResetDBService;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class DarwinoServiceDispatcher extends DarwinoJ2EEServiceDispatcherFilter {
	
	public DarwinoServiceDispatcher() {
	}
	
	/**
	 * Add the application specific services. 
	 */
	@Override
	protected void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The resetDB service is only when running in a J2EE environment as it needs the whole demo data project
		factories.add(new AppServiceFactory() {
			@Override
			protected void createServicesBinders(List<RestServiceBinder> binders) {
				super.createServicesBinders(binders);
				/////////////////////////////////////////////////////////////////////////////////
				// RESET DATABASE
				binders.add(new RestServiceBinder("resetdb") {
					@Override
					public HttpService createService(HttpServiceContext context, String[] parts) {
						return new ResetDBService();
					}
				});
			}	
		});
	}
}
