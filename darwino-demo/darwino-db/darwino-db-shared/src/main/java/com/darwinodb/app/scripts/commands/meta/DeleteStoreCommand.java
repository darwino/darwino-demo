/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import com.darwino.jsonstore.JsonDBException;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.impl.DefaultDatabaseDef;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.jsonstore.meta._Database;
import com.darwinodb.app.scripts.commands.BaseStoreCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="delete-store",description="Remove a store from a database",mixinStandardHelpOptions = true)
public  class DeleteStoreCommand extends BaseStoreCommand {

	@Option(names = {"--force"}, description = "Force the deployment")
	public boolean force;

	public DeleteStoreCommand() {
	}

	@Override
	public Integer call() throws Exception {
		checkDatabase();
		checkStore();
		
		Session session = getContext().getSession();
		_Database meta = session.getDatabaseMetadata(database);
		
		if(meta.getStore(store)==null) {
			throw new JsonDBException(null,"Database {0} doesn't hava a store {1}",database,store);
		}
		
		meta.getStoresMap().remove(store);

		meta.setVersion(meta.getVersion()+1);
				
		meta.setVersion(meta.getVersion()+1);		
		DatabaseFactory f = new DefaultDatabaseDef(meta);
		session.deployDatabase(database, f, force ? Session.DEPLOY_FORCE : Session.DEPLOY_REGULAR);
	
		println("Store {0} successfully removed from database {1}", database);

		return 0;
	}
}
