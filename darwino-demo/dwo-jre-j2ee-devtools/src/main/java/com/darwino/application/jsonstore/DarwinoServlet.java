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

package com.darwino.application.jsonstore;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;

import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.commons.services.resources.ResourcesRestFactory;
import com.darwino.commons.services.rest.RestServiceContributor;
import com.darwino.j2ee.servlet.server.servlet.ServiceDispatcherServlet;
import com.darwino.json.store.services.http.HttpServletJsonStoreServiceFactory;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.cursor.CursorService;
import com.darwino.platform.resources.DarwinoGlobalPathRewriter;
import com.darwino.platform.resources.DarwinoRootFileRewriter;
import com.darwino.platform.resources.DarwinoWebLibrariesRewriter;


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
		ResourcesRestFactory webLibFactory = new ResourcesRestFactory(
				getApplicationContext(),
				DarwinoGlobalPathRewriter.DARWINO_DEFAULT_LIBS_PATH,
				new DarwinoWebLibrariesRewriter());
		//resFactory.setMinified(Minified.MINIFIED);

		// Access to the application content
		ResourcesRestFactory appFactory = new ResourcesRestFactory(
				getApplicationContext(),
				null,
				new DarwinoRootFileRewriter());
		
		// json store
		HttpServletJsonStoreServiceFactory jsonFactory = new HttpServletJsonStoreServiceFactory(DarwinoGlobalPathRewriter.DARWINO_DEFAULT_JSONSTORE_PATH) {
			@Override
			protected RestServiceContributor getDefaultServiceContributor() {
				return new DefaultHttpServiceContributor(this) {
					@Override
					protected CursorService newCursorService(Store store, Index index, int method) {
						return new DevCursorService(store, index, method);
					}
				};
			}
		};

		HttpServiceFactories factories = new HttpServiceFactories(
			webLibFactory, appFactory, jsonFactory		
		);
		factories.setPathRewriter(new DarwinoGlobalPathRewriter());
		
		setServiceFactories(factories);
	}
	
}
