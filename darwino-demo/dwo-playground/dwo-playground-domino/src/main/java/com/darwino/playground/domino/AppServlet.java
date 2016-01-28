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

package com.darwino.playground.domino;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.domino.application.DarwinoApplicationServlet;
import com.darwino.domino.application.DarwinoDominoApplication;
import com.darwino.domino.application.DominoJsonStoreServiceFactory;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.cursor.CursorContentFilter;
import com.darwino.jsonstore.services.cursor.CursorService;
import com.darwino.platform.DarwinoHttpConstants;
import com.darwino.playground.app.AppServiceFactory;



/**
 * Domino Application Servlet.
 * 
 * @author priand
 */
public class AppServlet extends DarwinoApplicationServlet {
	
	private static final long serialVersionUID = 1L;

	public AppServlet() {
	}
	
	@Override
	protected DarwinoDominoApplication createDarwinoApplication(ServletContext servletContext) throws JsonException {
		return DarwinoApplication.create(servletContext);
	}

	@Override
	protected void addJsonStoreServiceFactories(HttpServiceFactories factories) {
		DominoJsonStoreServiceFactory jsonFactory = new DominoJsonStoreServiceFactory(DarwinoHttpConstants.JSONSTORE_PATH) {
			@Override
			protected DefaultServiceContributor getDefaultServiceContributor() {
				return new DefaultServiceContributor(this) {
					@Override
					protected CursorService newCursorService(Database database, Store store, Index index, int method, CursorContentFilter filter) {
						return new DevCursorService(database, store, index, method, filter);
					}
				};
			}
		};
		factories.add(jsonFactory);
	}
	
	/**
	 * 
	 * Add the application specific services. 
	 */
	@Override
	protected void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The service should always executed locally when running on a server
		factories.add(new AppServiceFactory());
	}
}
