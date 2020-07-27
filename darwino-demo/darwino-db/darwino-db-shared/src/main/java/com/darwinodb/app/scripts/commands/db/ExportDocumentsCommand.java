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

import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.impl.TaskExecutorImpl;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.impexp.JsonExport;
import com.darwino.jsonstore.impexp.JsonExport.ExportTarget;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.SocketProgress;
import com.darwinodb.app.scripts.commands.BaseDatabaseCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

/**
 * Import documents from a database command.
 */
@Command(name="export-documents",description="Export documents to a zip file",mixinStandardHelpOptions = true)
public class ExportDocumentsCommand extends BaseDatabaseCommand {
	
	@Option(names = {"-f", "--file"}, description = "File to export - If not specified, it uses [database id.zip]")
	public String file;

	@Option(names = {"--compact"}, description = "Compact the JSON documents")
	public boolean compact;

	@Option(names = {"--nometa"}, description = "Exclude the meta data of the documents and attachments")
	public boolean nometa;

	@Option(names = {"--noattachments"}, description = "Export the document attachments")
	public boolean noattachments;

	public ExportDocumentsCommand() {
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

		try {
			ExportTarget target = new JsonExport.ZipFileTarget(f);
			JsonExport export = new JsonExport(target);
			export.setCompact(compact);
			export.setMetadata(!nometa);
			export.setAttachments(!noattachments);
			export.setAttachmentsMetadata(!nometa);
			SocketProgress progress = (SocketProgress)TaskExecutorImpl.getExecutorContext().getTaskProgress();
			export.setProgress(progress.createChild());
			int c = export.exportDocuments(database);
			progress.sendToSocket(); // resent the current state
			println("{0} documents exported from database {1}",c,database.getId());
		} catch(JsonException ex) {
			throw new DSRuntimeException(ex,"Error while exporting the documents");
		}
		return 0;
	}
}
