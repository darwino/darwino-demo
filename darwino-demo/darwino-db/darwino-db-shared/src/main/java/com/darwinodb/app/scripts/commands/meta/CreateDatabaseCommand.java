/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import java.io.File;

import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.impl.DefaultDatabaseDef;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="create-database",description="Create and deploy a database",mixinStandardHelpOptions = true)
public  class CreateDatabaseCommand extends BaseDatabaseCommand {

	@Option(names = {"-f", "--file"}, description = "Database meta-data file")
	public String file;

	@Option(names = {"--force"}, description = "Force the deployment")
	public boolean force;

	public CreateDatabaseCommand() {
	}

	@Override
	public Integer call() throws Exception {
		checkDatabase();
		
		Object meta = null;

		if(file!=null) {
			File metaFile = new File(Main.get().getFilesDir(),file);
			if(!metaFile.exists()) {
				throw new DSRuntimeException(null,"Meta data file {0} does not exist");
			}
			meta = StreamUtil.readString(metaFile);
		} else {
			meta = new DefaultDatabaseDef(database);
		}
		
		Session session = getContext().getSession();
		session.deployDatabase(database,meta,force ? Session.DEPLOY_FORCE : Session.DEPLOY_REGULAR);
		
		println("Database {0} successfully created", database);

		return 0;
	}
}
