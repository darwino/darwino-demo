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

package DWOTPL_PACKAGENAME.app;

import java.util.concurrent.Executors;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.tasks.TaskProgress;
import com.darwino.commons.tasks.impl.CustomTaskExecutorService;
import com.darwino.commons.tasks.scheduler.TaskScheduler;
import com.darwino.commons.tasks.scheduler.impl.TaskSchedulerImpl;
import com.darwino.domino.application.DarwinoActivator;
import com.darwino.domino.application.DarwinoDominoApplication;
import com.darwino.j2ee.application.BackgroundServletSynchronizationExecutor;

public class AppActivator extends DarwinoActivator {

	private static AppActivator plugin;
	

	public static AppActivator getDefault() {
		return plugin;
	}

	private BackgroundServletSynchronizationExecutor syncExecutor; 
	
	public AppActivator() {
		plugin = this;
		
		getInitParameters().put("dwo-auto-deploy-jsonstore",	"${DWOTPL_PROPPREFIX.auto-deploy-jsonstore=true}");
		getInitParameters().put("dwo-sync-enabled", 			"${DWOTPL_PROPPREFIX.sync-enabled=false}");
		getInitParameters().put("dwo-sync-emptyjsondbonstart", 	"${DWOTPL_PROPPREFIX.sync-emptyjsondbonstart=false}");
		getInitParameters().put("dwo-sync-url", 				"${DWOTPL_PROPPREFIX.sync-url=http://127.0.0.1/darwino.sync}");
		getInitParameters().put("dwo-sync-platform", 			"${DWOTPL_PROPPREFIX.sync-platform=domino}");
		getInitParameters().put("dwo-sync-commit-threshold", 	"${DWOTPL_PROPPREFIX.sync-commit-threshold=100}");
		getInitParameters().put("dwo-sync-instances", 			"${DWOTPL_PROPPREFIX.sync-instances}");
		getInitParameters().put("dwo-sync-user", 				"${DWOTPL_PROPPREFIX.sync-user}");
		getInitParameters().put("dwo-sync-password", 			"${DWOTPL_PROPPREFIX.sync-password}");
		getInitParameters().put("dwo-sync-mode", 				"${DWOTPL_PROPPREFIX.sync-mode=pull+push}");
		getInitParameters().put("dwo-sync-period", 				"${DWOTPL_PROPPREFIX.sync-period}");
		getInitParameters().put("dwo-sync-retry-delay", 		"${DWOTPL_PROPPREFIX.sync-retry-delay}");
		getInitParameters().put("dwo-sync-initial-delay", 		"${DWOTPL_PROPPREFIX.sync-initial-delay}");
		getInitParameters().put("dwo-sync-trace", 				"${DWOTPL_PROPPREFIX.sync-trace=false}");
	}

	@Override
	protected DarwinoDominoApplication createDarwinoApplication(ServletContext servletContext) throws JsonException {
		return DarwinoApplication.create(servletContext); 
	}


	@Override
	protected void initAsync(ServletContext servletContext, TaskProgress progress) throws JsonException {
		super.initAsync(servletContext, progress);
		
		// Initialize the replication asynchronously so the database is properly deployed before it starts
		initReplication(servletContext, progress);
	}

	protected void initReplication(ServletContext servletContext, TaskProgress progress) throws JsonException {
		// We use a custom task scheduler to limit the # of threads being used
		TaskScheduler taskScheduler = new TaskSchedulerImpl() {
			TaskExecutorService svc = new CustomTaskExecutorService(Executors.newFixedThreadPool(5));
			@Override
			public TaskExecutorService getTaskExecutorService() {
		    	return svc;
		    }
		};
 		// Define these to enable the background replication with another server 
		syncExecutor = new BackgroundServletSynchronizationExecutor(getApplication(), taskScheduler, servletContext) {
			@Override
			public String[] getSyncDatabases() {
				return AppDatabaseDef.DATABASES;
			}
		};
		syncExecutor.start();
	}
}
