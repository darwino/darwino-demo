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
