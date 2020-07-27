/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.JsonDBException;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.impl.DefaultDatabaseDef;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.meta._Database;
import com.darwino.jsonstore.meta._Store;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="add-store",description="Add a store to a database",mixinStandardHelpOptions = true)
public  class AddStoreCommand extends BaseStoreCommand {

	@Option(names = {"-o", "--options"}, description = "Store options as JSON string")
	public String options;

	@Option(names = {"--force"}, description = "Force the deployment")
	public boolean force;

	public AddStoreCommand() {
	}

	@Override
	public Integer call() throws Exception {
		checkDatabase();
		checkStore();
		
		Session session = getContext().getSession();
		_Database meta = session.getDatabaseMetadata(database);
		
		if(meta.getStore(store)!=null) {
			throw new JsonDBException(null,"Database {0} already has a store {1}",database,store);
		}
		
		_Store st = new _Store(store);
		if(StringUtil.isNotEmpty(options)) {
			JsonObject opt = JsonObject.fromJson(options);
			st.fromJson(opt);
		} else {
			st.setFtSearchEnabled(true);
		}
		meta.getStoresMap().put(store,st);
		
		meta.setVersion(meta.getVersion()+1);		
		DatabaseFactory f = new DefaultDatabaseDef(meta);
		session.deployDatabase(database, f, force ? Session.DEPLOY_FORCE : Session.DEPLOY_REGULAR);
	
		println("Store {0} successfully added to database {1}", database);

		return 0;
	}
}
