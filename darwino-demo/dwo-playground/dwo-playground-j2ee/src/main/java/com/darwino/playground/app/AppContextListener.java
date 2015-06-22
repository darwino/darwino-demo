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

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import com.darwino.commons.json.JsonException;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;
import com.darwino.jre.application.DarwinoJreApplication;

/**
 * Servlet listener for initializing the application.
 * 
 * @author Philippe Riand
 */
public class AppContextListener extends AbstractDarwinoContextListener {
	
	private BackgroundServletSynchronizationExecutor syncExecutor; 
	
	public AppContextListener() {
	}
	
	@Override
	protected DarwinoJreApplication createDarwinoApplication(ServletContext context) throws JsonException {
		return DarwinoApplication.create(context);
	}

	@SuppressWarnings("unused")
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		super.contextInitialized(sce);

		if(false) {
			syncExecutor = new BackgroundServletSynchronizationExecutor(sce.getServletContext());
			syncExecutor.putPropertyValue("dwo-sync-database",AppDatabaseDef.DATABASE_NAME);
			syncExecutor.start();
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		if(syncExecutor!=null) {
			syncExecutor.stop();
			syncExecutor = null;
		}
	}
}
