/*!COPYRIGHT HEADER! 
 *
 */

package com.contacts.app;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;

import com.contacts.app.tasks.LogTask;
import com.contacts.app.triggers.LogHandler;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.commons.tasks.scheduler.TaskScheduler;
import com.darwino.commons.tasks.scheduler.schedulers.IntervalScheduler;
import com.darwino.commons.util.StringUtil;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.platform.events.builder.EventBuilderFactory;
import com.darwino.platform.events.builder.StaticEventBuilder;
import com.darwino.platform.events.jsonstore.JsonStoreChangesTrigger;
import com.darwino.platform.persistence.JsonStorePersistenceService;

/**
 * Servlet listener for initializing the application.
 * 
 * @author Philippe Riand
 */
public class AppContextListener extends AbstractDarwinoContextListener {

	public static final boolean HAS_TRIGGERS 	= true;
	public static final boolean HAS_TASKS 		= true;
	
	private BackgroundServletSynchronizationExecutor syncExecutor; 
	private EventBuilderFactory triggers;
	
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
		
		if(HAS_TRIGGERS) {
			// Enable triggers for notifications unless they are disabled
			if(!StringUtil.equals(Platform.getConfigProperty(getApplication().getManifest().getConfigId(),"triggers.disable"),"true")) {
				initTriggers(servletContext, progress);
			}
		}
			
		if(HAS_TASKS) {
			// Enable scheduled tasks unless they are disabled
			if(!StringUtil.equals(Platform.getConfigProperty(getApplication().getManifest().getConfigId(),"tasks.disable"),"true")) {
				initTasks(servletContext, progress);
			}
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		if(syncExecutor!=null) {
			syncExecutor.stop();
			syncExecutor = null;
		}
		if(HAS_TRIGGERS && triggers!=null) {
			triggers.uninstall();
			triggers = null;
		}
		if(HAS_TASKS) {
			final TaskScheduler scheduler = Platform.getService(TaskScheduler.class);
			scheduler.removeAllScheduledTasks();
		}
		
		super.contextDestroyed(sce);
	}
	
	protected void initReplication(ServletContext servletContext, TaskProgress progress) throws JsonException {
 		// Define these to enable the background replication with another server 
		syncExecutor = new BackgroundServletSynchronizationExecutor(getApplication(),servletContext);
		syncExecutor.putPropertyValue("dwo-sync-database",AppDatabaseDef.DATABASE_NAME);
		syncExecutor.start();
	}


	protected void initTriggers(ServletContext servletContext, TaskProgress progress) throws JsonException {
		// Install the triggers
		// This trigger monitors the document changes in the default database
		// A store, or a query, can be specified as well. By default, the _local store is not processed
		// One can also use JsonStoreTrigger to simply select by query and do not care about the dates
		StaticEventBuilder triggerList = new StaticEventBuilder();
		triggerList.add(new JsonStoreChangesTrigger()
				.scheduler("10s")
				.database(AppDatabaseDef.DATABASE_NAME)
				//.store(Database.STORE_DEFAULT)
				.maxEntries(10) // For demo purposes, only process the last 10 docs...
				.handler(new LogHandler())
			);
		
		// Use a persistence service for the dates
		JsonStorePersistenceService svc = new JsonStorePersistenceService()
				.database(AppDatabaseDef.DATABASE_NAME)
				.category("trigger");
		triggers = new EventBuilderFactory(triggerList,svc);
		triggers.install();
	}

	protected void initTasks(ServletContext servletContext, TaskProgress progress) throws JsonException {
		final TaskScheduler scheduler = Platform.getService(TaskScheduler.class);
		
		// Install the tasks
		// This tasks logs a string every 10secs
		scheduler.scheduleTask(
				new LogTask(),
				new IntervalScheduler().interval("10s"));
	}
}
