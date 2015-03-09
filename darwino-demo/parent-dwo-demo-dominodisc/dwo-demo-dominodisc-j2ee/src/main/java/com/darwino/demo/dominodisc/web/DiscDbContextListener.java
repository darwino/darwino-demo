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

package com.darwino.demo.dominodisc.web;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import com.darwino.commons.json.JsonException;
import com.darwino.demo.dominodisc.DiscDbDatabaseDef;
import com.darwino.demo.dominodisc.DiscDbManifest;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;

/**
 * Servlet listener for initializing the Discussion Database application.
 * 
 * Moreover, it also defines a background synchronization thread to synchronize the Darwino and Domino
 * This is a simple class, not designed to work with container managed threads, or in cluster.
 * 
 * @author Philippe Riand
 */
public class DiscDbContextListener extends AbstractDarwinoContextListener {
	
	private BackgroundServletSynchronizationExecutor syncExecutor; 
	
	public DiscDbContextListener() {
	}
	
	@Override
	protected DarwinoJ2EEApplication createDarwinoApplication(ServletContext context) throws JsonException {
		return new DiscDbJ2EEApplication(new DiscDbManifest(false,null));
	}
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		super.contextInitialized(sce);
		
		syncExecutor = new BackgroundServletSynchronizationExecutor(sce.getServletContext());
		syncExecutor.putPropertyValue("dwo-sync-database",DiscDbDatabaseDef.DATABASE_DOMDISC);
		syncExecutor.start();
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		if(syncExecutor!=null) {
			syncExecutor.stop();
			syncExecutor = null;
		}
	}
}
