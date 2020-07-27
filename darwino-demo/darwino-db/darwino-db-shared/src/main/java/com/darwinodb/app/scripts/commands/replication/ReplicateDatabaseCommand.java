/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.replication;

import java.io.IOException;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpConnection;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorService;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.replication.Replicator;
import com.darwino.jsonstore.replication.ReplicatorLocalDatabaseFromHttp;
import com.darwino.jsonstore.replication.background.BackgroundInstanceReplicationTask;
import com.darwino.jsonstore.replication.background.BackgroundReplicationTask;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.ScriptsProgramContext;
import com.darwinodb.app.scripts.SocketProgress;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="replicate-database",description="Replicate the database",mixinStandardHelpOptions = true)
public class ReplicateDatabaseCommand extends BaseDatabaseCommand {

	@Option(names = {"-c", "--connection"}, description = "Name of the HTTP connection to use, or default")
	public String connection;
	
	@Option(names = {"--pull"}, description = "Pull the data from the target server")
	public boolean pull;
	
	@Option(names = {"--push"}, description = "Only push the local data to the target server")
	public boolean push;

//	@Option(names = {"-t", "--target"}, description = "Name of the target database")
//	public String target;
	
	@Option(names = {"--background"}, description = "Execute the replication as a background task")
	public boolean background;

	public ReplicateDatabaseCommand() {
	}
	
	
	@Override
	public Integer call() throws Exception {
		if(StringUtil.isEmpty(database)) {
			throw new DSRuntimeException(null,"The database name is missing");
		}
		String cname = "default";
		if(StringUtil.isNotEmpty(connection)) {
			cname = connection;
		}

		// Start the replication
		Database db = getDatabase();
		if(!db.isReplicationEnabled()) {
			throw new DSRuntimeException(null,"Replication is not enabled for database {0}",database);
		}
		
		if(!push && !pull) {
			push = pull = true;
		}
		
		ScriptsProgramContext context = getContext();
		
		BackgroundReplicationTask task = createTask(cname);
		TaskExecutorService svc = Platform.getService(TaskExecutorService.class);
		TaskExecutor<Void>  exec = svc.createExecutor(background);
		exec.setTaskProgress(new SocketProgress(context.getSocket()));
		exec.exec(task);
		
		if(background) {
			println("Background replication started for database {0} with connection {1}",database,cname);
		} else {
			println("Replication completed for database {0} with connection {1}",database,cname);
		}
		
		return 0;
	}
	
	protected BackgroundInstanceReplicationTask createTask(String cname) throws CloneNotSupportedException {
		final Session session = background ? getSession().clone() : getSession();
		BackgroundInstanceReplicationTask task = new BackgroundInstanceReplicationTask() {
			@Override
			protected Context createContext() throws JsonException {
				return new Context() {
					@Override
					public String toString() {
						return connection;
					}
					@Override
					public void close() throws IOException {
						if(background) {
							StreamUtil.close(session);
						}
					}
					@Override
					public Replicator createReplicator(String databaseName,String instanceName, String remoteDatabase) throws JsonException {
						String remoteDBName = StringUtil.isEmpty(remoteDatabase) ? databaseName : remoteDatabase;
						Database db = session.getDatabase(databaseName,instanceName);
						HttpConnection conn = Platform.getManagedBean(HttpConnection.BEAN_TYPE, cname);
						//HttpClient httpClient = conn.createHttpClient(DarwinoHttpConstants.DARWINO_JSTORE_ALIAS);						
						HttpClient httpClient = conn.createHttpClient();						
						ReplicatorLocalDatabaseFromHttp replicator = new ReplicatorLocalDatabaseFromHttp(db, httpClient, remoteDBName);
						//replicator.setTrace(isTrace());
						//replicator.setThreadCount(getThreadCount());
						//replicator.setMultithreadThreshold(getMultithreadThreshold());
						return replicator;
					}
				};
			}
		};
		
		task.setDatabase(database);
		//task.setInstances(getSyncInstances());
		task.setPush(push);
		task.setPull(pull);
		//task.setRetryDelayMs(getRetryDelayMs());
		//task.setCommitThreshold(getCommitThreshold());
		return task;
	}
}
