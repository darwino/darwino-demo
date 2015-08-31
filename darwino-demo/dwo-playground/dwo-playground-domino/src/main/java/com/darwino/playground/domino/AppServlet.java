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
