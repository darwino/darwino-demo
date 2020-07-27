/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.Mutable;
import com.darwino.commons.util.StringArray;
import com.darwino.commons.util.StringUtil;
import com.darwino.script.DSRuntimeContext;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.scripts.ScriptsProgramContext;
import com.darwinodb.app.scripts.commands.db.CountDocumentsCommand;
import com.darwinodb.app.scripts.commands.db.CreateDocumentCommand;
import com.darwinodb.app.scripts.commands.db.DeleteAllDocumentsCommand;
import com.darwinodb.app.scripts.commands.db.DeleteDocumentCommand;
import com.darwinodb.app.scripts.commands.db.ExportDocumentsCommand;
import com.darwinodb.app.scripts.commands.db.ImportDocumentsCommand;
import com.darwinodb.app.scripts.commands.db.ListDocumentsCommand;
import com.darwinodb.app.scripts.commands.db.UpdateDocumentCommand;
import com.darwinodb.app.scripts.commands.domino.ImportFormsCommand;
import com.darwinodb.app.scripts.commands.files.InstallFilesCommand;
import com.darwinodb.app.scripts.commands.files.ListFilesCommand;
import com.darwinodb.app.scripts.commands.meta.AddStoreCommand;
import com.darwinodb.app.scripts.commands.meta.CreateDatabaseCommand;
import com.darwinodb.app.scripts.commands.meta.DeleteDatabaseCommand;
import com.darwinodb.app.scripts.commands.meta.DeleteStoreCommand;
import com.darwinodb.app.scripts.commands.meta.ExportDatabaseCommand;
import com.darwinodb.app.scripts.commands.meta.ListDatabasesCommand;
import com.darwinodb.app.scripts.commands.meta.ListStoresCommand;
import com.darwinodb.app.scripts.commands.replication.CreateReplicaCommand;
import com.darwinodb.app.scripts.commands.replication.ReplicateDatabaseCommand;

import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.IExecutionExceptionHandler;
import picocli.CommandLine.ParseResult;

/**
 * List of available commands
 */
public class CommandList {
	
	private static CommandList instance = new CommandList();
	public static CommandList get() {
		return instance;
	}
	
	private Map<String,Class<? extends AbstractCommand>> commands = new HashMap<>();
	
	public CommandList() {
		add(HelpCommand.class);
		
		// Meta-data
		add(ListDatabasesCommand.class);
		add(ListStoresCommand.class);
		add(CreateDatabaseCommand.class);
		add(AddStoreCommand.class);
		add(DeleteStoreCommand.class);
		add(UpdateDocumentCommand.class);
		add(DeleteDatabaseCommand.class);
		add(ExportDatabaseCommand.class);

		// DB
		add(ListDocumentsCommand.class);
		add(CountDocumentsCommand.class);
		add(CreateDocumentCommand.class);
		add(DeleteDocumentCommand.class);
		add(DeleteAllDocumentsCommand.class);
		add(ImportDocumentsCommand.class);
		add(ExportDocumentsCommand.class);

		// Replication
		add(CreateReplicaCommand.class);
		add(ReplicateDatabaseCommand.class);
		
		// Files
		add(ListFilesCommand.class);
		add(InstallFilesCommand.class);
		
		// Domino
		add(ImportFormsCommand.class);
	}
	
	public Map<String,Class<? extends AbstractCommand>> getCommands() {
		return commands;
	}
	
	public CommandList add(Class<? extends AbstractCommand> commandClass) { 
		Command cmd = commandClass.getAnnotation(Command.class);
		commands.put(cmd.name(),commandClass);
		return this;
	}
	
	public int executeCommand(DSRuntimeContext ctx, String command) throws DSRuntimeException {
		final ScriptsProgramContext cmdContext = (ScriptsProgramContext)ctx.getProgramContext();
		
		command = StringUtil.trim(command);
		if(StringUtil.isEmpty(command)) {
			return 0;
		}
		String cmdName = command;
		String[] cmdArgs = StringArray.EMPTY_ARRAY;
		
		int pos = command.indexOf(' ');
		if(pos>=0) {
			cmdName = command.substring(0,pos).trim();
			cmdArgs = (new Parser()).parseArgs(command.substring(pos+1));
		}
		Class<? extends AbstractCommand> cmdClass = commands.get(cmdName);
		if(cmdClass==null) {
			throw new DSRuntimeException(null,"Unknown command {0}", cmdName);
		}
		
		AbstractCommand cmdInstance;
		try {
			cmdInstance = cmdClass.newInstance();
			cmdInstance.setContext(cmdContext);
		} catch(Exception ex) {
			throw new DSRuntimeException(ex);
		}
		
		Mutable<Throwable> error = new Mutable<>();
		int r = new CommandLine(cmdInstance)
						.setOut(ctx.getProgramContext().getStdout())
						.setErr(ctx.getProgramContext().getStderr())
						.setExecutionExceptionHandler(new IExecutionExceptionHandler() {
							@Override
							public int handleExecutionException(Exception ex, CommandLine commandLine, ParseResult parseResult) throws Exception {
								error.set(ex);
								return 1;
							}							
						})
						.execute(cmdArgs);
		if(r>0) {
			throw new DSRuntimeException(error.get(),"");
		}
		return 0;
	}
	
	public int executeCommand(DSRuntimeContext ctx, String command, JsonObject params) throws DSRuntimeException {
		final ScriptsProgramContext cmdContext = (ScriptsProgramContext)ctx.getProgramContext();

		String cmdName = command;
		Class<? extends AbstractCommand> cmdClass = commands.get(cmdName);
		if(cmdClass==null) {
			throw new DSRuntimeException(null,"Unknown command {0}", cmdName);
		}
				
		AbstractCommand cmdInstance;
		try {
			cmdInstance = cmdClass.newInstance();
			cmdInstance.setContext(cmdContext);
		} catch(Exception ex) {
			throw new DSRuntimeException(ex);
		}
		
		try {
			int r = cmdInstance.execute(params);
			if(r>0) {
				throw new DSRuntimeException(null,"Error while executing command {0}", command);
			}
		} catch (Exception ex) {
			throw new DSRuntimeException(ex,"Error while executing command {0}", command);
		}
		return 0;
	}
	
	
	private static class Parser {
		int start;
		String[] parseArgs(String argsString) {
			List<String> args = new ArrayList<String>();
			while(start<argsString.length()) {
				skipSpaces(argsString);
				String a = readString(argsString);
				if(StringUtil.isNotEmpty(a)) {
					args.add(a);
				}
			}
			return args.toArray(new String[args.size()]);
		}
		private String readString(String argsString) {
			if(start<argsString.length()) {
				StringBuilder str = new StringBuilder();
				char fc = argsString.charAt(start);
				if(fc=='"') {
					start++;
					while(start<argsString.length()) {
						char c=argsString.charAt(start++);
						if(c=='"') {
							break;
						}
						str.append(c);
					}
				} else {
					while(start<argsString.length()) {
						char c=argsString.charAt(start++);
						if(isSpaceChar(c)) {
							break;
						}
						str.append(c);
					}
				}
				return str.toString();
			} else {
				return "";
			}
		}
		private void skipSpaces(String argsString) {
			while(start<argsString.length()) {
				char c=argsString.charAt(start);
				if(!isSpaceChar(c)) {
					return;
				}
				start++;
			}
		}
		private boolean isSpaceChar(char c) { 
			return c==' ' || c=='\t';
		}
	}
}