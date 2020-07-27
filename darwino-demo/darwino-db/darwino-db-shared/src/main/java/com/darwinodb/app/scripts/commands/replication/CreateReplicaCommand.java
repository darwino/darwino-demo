/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.replication;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpClient;
import com.darwino.commons.httpclnt.HttpConnection;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Session;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="create-replica",description="Create a database replica",mixinStandardHelpOptions = true)
public  class CreateReplicaCommand extends BaseDatabaseCommand {

	@Option(names = {"-c", "--connection"}, description = "Name of the HTTP connection to use")
	private String connection;
	
	@Option(names = {"--force"}, description = "Force the deployment regardless the version number")
	public boolean force;

	public CreateReplicaCommand() {
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
		
		HttpConnection conn = Platform.getManagedBean(HttpConnection.BEAN_TYPE, cname);
		HttpClient c = conn.createHttpClient();
		
		// Read the meta-data
		JsonObject meta = (JsonObject)c.getAsJson(new String[] {"$darwino-jstore","databases",database});
		
		// Read the meta-data
		Session session = getContext().getSession();
		session.deployDatabase(database,meta,force ? Session.DEPLOY_FORCE : Session.DEPLOY_REGULAR);
		
		println("Database {0} successfully created from connection {1}", database, connection);
		
		return 0;
	}
}
