/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwinodb.app.scripts.commands.db;

import java.io.File;

import com.darwino.commons.tasks.impl.TaskExecutorImpl;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.impexp.JsonImport;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.SocketProgress;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Import documents from a database command.
 */
@Command(name="import-documents",description="Import documents from a zip file",mixinStandardHelpOptions = true)
public class ImportDocumentsCommand extends BaseDatabaseCommand {
	
	@Option(names = {"-f", "--file"}, description = "File to import - If not specified, it uses [database id.zip]")
	public String file;

	public ImportDocumentsCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		Database database = getDatabase();
		
		String name = file;
		if(StringUtil.isEmpty(name)) {
			name = database.getId();
		}
		if(!name.endsWith(".zip")) {
			name += ".zip";
		}
		
		File f = new File(Main.get().getFilesDir(),name);
		if(!f.exists()) {
			throw new DSRuntimeException(null,"File {0} does not exist ({1})",name, f.getPath());
		}

		try {
			JsonImport im = new JsonImport(new JsonImport.FileSource(f));
			SocketProgress progress = (SocketProgress)TaskExecutorImpl.getExecutorContext().getTaskProgress();
			im.setProgress(progress.createChild());
			int c = im.importDocuments(database);
			progress.sendToSocket(); // resent the current state
			println("{0} documents imported to database {1}", c, database.getId());
		} catch(Exception ex) {
			throw new DSRuntimeException(ex,"Error while importing the documents");
		}

		return 0;
	}
}
