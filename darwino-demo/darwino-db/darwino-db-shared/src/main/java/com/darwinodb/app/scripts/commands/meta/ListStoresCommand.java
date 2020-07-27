/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;

@Command(name="list-stores",description="List of stores in a database",mixinStandardHelpOptions = true)
public  class ListStoresCommand extends BaseDatabaseCommand {

	public ListStoresCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		listStores();
		return 0;
	}
}
