/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import com.darwino.commons.util.QuickSort;
import com.darwino.jsonstore.Session;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;

@Command(name="list-databases",description="List deployed databases",mixinStandardHelpOptions = true)
public  class ListDatabasesCommand extends BaseDatabaseCommand {

	public ListDatabasesCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Session session = getContext().getSession();
		String[] dbs = session.getDatabaseList();
		new QuickSort.StringArray(dbs);
		println("List of databases:");
		for(int i=0; i<dbs.length; i++) {
			println("    {0} [{1}]", dbs[i], session.getDatabase(dbs[i]).documentCount());
		}
		return 0;
	}
}
