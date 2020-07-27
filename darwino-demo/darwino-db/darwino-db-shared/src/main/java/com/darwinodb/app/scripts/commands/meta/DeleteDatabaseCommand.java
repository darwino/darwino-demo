/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import com.darwino.jsonstore.Session;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;

@Command(name="delete-database",description="Delete a deployed database",mixinStandardHelpOptions = true)
public  class DeleteDatabaseCommand extends BaseDatabaseCommand {

	public DeleteDatabaseCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		checkDatabase();
		
		Session session = getContext().getSession();
		session.undeployDatabase(database);
		
		println("Database {0} successfully deleted", database);

		return 0;
	}
}
