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

package com.darwino.application.jsonstore;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.commons.services.resources.ResourcesRestFactory;
import com.darwino.commons.services.rest.RestServiceContributor;
import com.darwino.j2ee.services.jstore.J2EEServletJsonStoreServiceFactory;
import com.darwino.j2ee.servlet.server.servlet.ServiceDispatcherServlet;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.cursor.CursorContentFilter;
import com.darwino.jsonstore.services.cursor.CursorService;
import com.darwino.platform.DarwinoHttpConstants;
import com.darwino.platform.resources.DarwinoLibsResourcesRestFactory;


/**
 * Json store servlet for Darwino.
 * 
 * @author Philippe Riand
 */
public class DarwinoServlet extends ServiceDispatcherServlet {

	private static final long serialVersionUID = 1L;

	public DarwinoServlet() {
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
		// Access to the web libs
		ResourcesRestFactory webLibFactory = new DarwinoLibsResourcesRestFactory(
				getApplicationContext(),
				DarwinoHttpConstants.LIBS_PATH,
				DarwinoLibsResourcesRestFactory.DEFAULT_LIBS_PATH);

		// Access to the application content
		ResourcesRestFactory appFactory = new ResourcesRestFactory(
				getApplicationContext(),
				null);
		
		// json store
		J2EEServletJsonStoreServiceFactory jsonFactory = new J2EEServletJsonStoreServiceFactory(DarwinoHttpConstants.JSONSTORE_PATH) {
			@Override
			protected RestServiceContributor getDefaultServiceContributor() {
				return new DefaultHttpServiceContributor(this) {
					@Override
					protected CursorService newCursorService(Database database, Store store, Index index, int method, CursorContentFilter filter) {
						return new DevCursorService(database, store, index, method, filter);
					}
				};
			}
		};

		HttpServiceFactories factories = new HttpServiceFactories(
			webLibFactory, appFactory, jsonFactory		
		);
		
		setServiceFactories(factories);
	}
	
}
