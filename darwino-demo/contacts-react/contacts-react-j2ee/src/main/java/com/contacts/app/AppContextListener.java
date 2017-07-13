/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;

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
	protected DarwinoJ2EEApplication createDarwinoApplication(ServletContext context) throws JsonException {
		return AppJ2EEApplication.create(context);
	}
	
	@Override
	protected void initAsync(ServletContext servletContext, TaskProgress progress) throws JsonException {
		super.initAsync(servletContext, progress);
		
		// Initialize the replication asynchronously so the database is properly deployed before it starts
		initReplication(servletContext, progress);
		
		// Enable triggers for notifications
		//initTriggers(servletContext, progress);
	}

	protected void initReplication(ServletContext servletContext, TaskProgress progress) throws JsonException {
 		// Define these to enable the background replication with another server 
		syncExecutor = new BackgroundServletSynchronizationExecutor(getApplication(),servletContext);
		syncExecutor.putPropertyValue("dwo-sync-database",AppDatabaseDef.DATABASE_NAME);
		syncExecutor.start();
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		if(syncExecutor!=null) {
			syncExecutor.stop();
			syncExecutor = null;
		}
		super.contextDestroyed(sce);
	}

/*	
	protected void initTriggers(ServletContext servletContext, TaskProgress progress) throws JsonException {
		// Install the handlers
		//StaticEventBuilder triggerList = new StaticEventBuilder();
		//triggerList.add(...);
		//triggers = new EventBuilderFactory(triggerList,null);
		//triggers.install();
	}
*/
}
