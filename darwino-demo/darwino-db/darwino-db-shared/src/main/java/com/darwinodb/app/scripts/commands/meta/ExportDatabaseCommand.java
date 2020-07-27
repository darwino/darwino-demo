/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.meta;

import java.io.File;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Database;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="export-database",description="Export the description of a deployed database",mixinStandardHelpOptions = true)
public  class ExportDatabaseCommand extends BaseDatabaseCommand {

	@Option(names = {"-f", "--file"}, description = "Database meta-data file")
	public String file;

	public ExportDatabaseCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		checkDatabase();

		String name = file;
		if(StringUtil.isEmpty(name)) {
			name = database + ".database.json";
		}
		File metaFile = new File(Main.get().getFilesDir(),name);
		
		Database database = getDatabase();
		JsonObject meta = (JsonObject)database.getJsonMetadata();
	
		StreamUtil.writeString(metaFile, meta.toJson(false));
		
		println("Database description {0} exported to {1}", database, metaFile);

		return 0;
	}
}
