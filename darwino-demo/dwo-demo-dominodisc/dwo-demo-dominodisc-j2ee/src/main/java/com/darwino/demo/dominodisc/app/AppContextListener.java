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

package com.darwino.demo.dominodisc.app;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.demo.dominodisc.watson.AnalyzeTask;
import com.darwino.demo.dominodisc.watson.TranslationTask;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jsonstore.replication.ReplicationProfile;
import com.darwino.jsonstore.replication.background.BackgroundInstanceReplicationTask;

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
	public void initSync(ServletContext servletContext) throws Exception {
		super.initSync(servletContext);
	
		// Install the synchronization mechanism
		syncExecutor = new BackgroundServletSynchronizationExecutor(servletContext) {
			@Override
			protected BackgroundInstanceReplicationTask createTask(String database) {
				// Ignore the translation stores when replicating with Domino
				BackgroundInstanceReplicationTask task = super.createTask(database);
				ReplicationProfile profile = new ReplicationProfile();
				profile.setSelectStores(new String[]{AppDatabaseDef.STORE_NSFDATA,AppDatabaseDef.STORE_CONFIG});
				task.setProfile(profile);
				return task;
			}
		};
		syncExecutor.putPropertyValue("dwo-sync-database",AppDatabaseDef.DATABASE_NAME);
		syncExecutor.start();
		
		// Install the Watson translator
		String[] instances = new String[]{"discdb/xpagesforum.nsf"}; // AppDatabaseDef.getInstances()
		TranslationTask.install(instances);
		AnalyzeTask.install(instances);
	}

	@Override
	public void destroyApplication(ServletContext servletContext, TaskProgress progress) throws Exception {
		if(syncExecutor!=null) {
			syncExecutor.stop();
			syncExecutor = null;
		}
		super.destroyApplication(servletContext, progress);
	}
}
