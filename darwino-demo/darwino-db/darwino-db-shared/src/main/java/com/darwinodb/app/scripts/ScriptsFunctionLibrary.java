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

package com.darwinodb.app.scripts;

import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.StringUtil;
import com.darwino.script.DSEnvironment;
import com.darwino.script.DSRuntimeContext;
import com.darwino.script.DSRuntimeException;
import com.darwino.script.library.FunctionLibrary;
import com.darwinodb.app.scripts.commands.CommandList;


/**
 * Model based library.
 */
public class ScriptsFunctionLibrary extends FunctionLibrary {

	static enum FunctionIndex {
		execCommand,
	}

	public ScriptsFunctionLibrary() {
		// Debug functions
		addFunction(new StandardFunction("execCommand",FunctionIndex.execCommand));
		
		CommandList l = CommandList.get();
		for(String command: l.getCommands().keySet()) {
			String functionName = toCamelCase(command);
			addFunction(new CommandFunction(functionName, command));
		}
	}

	private static String toCamelCase(String s) {
		int len = s.length();
		StringBuilder b = new StringBuilder(len);
		boolean toUpper = false;
		for(int i=0; i<len; i++) {
			char c = s.charAt(i);
			if(c=='-') {
				toUpper = true;
				continue;
			} 
			if(Character.isLetter(c)) {
				b.append(toUpper ? Character.toUpperCase(c) : Character.toLowerCase(c));
			} else if(Character.isDigit(c)) {
				b.append(c);
			}
			toUpper = false;
		}
		return b.toString();
	}
	private static final class CommandFunction extends Function {
		private String command;

		CommandFunction(String functionName, String command) {
			super(functionName);
			this.command = command;
		}

		@Override
		public Object call(DSRuntimeContext ctx, Object[] parameters) throws DSRuntimeException {
			if(parameters!=null && parameters.length>1) {
				throw new DSRuntimeException(null,"{0}() should only have one parameter",getFunctionName());
			}
			Object p = parameters!=null && parameters.length==1 ? parameters[0] : null;
			if(p!=null && !(p instanceof JsonObject)) {
				throw new DSRuntimeException(null,"{0}() parameter must be a JSON object",getFunctionName());
			}
			CommandList l = CommandList.get();
			
			JsonObject jo =  (JsonObject)p;
			
			
			ctx.getStdout().println(StringUtil.format("> {0} {1}",command,jo!=null ? jo.toString(true) : ""));
			int r = l.executeCommand(ctx, command, jo);
			ctx.getStdout().println("");
			return r;
		}
	}
	
	private static final class StandardFunction extends Function {
		private FunctionIndex index;

		StandardFunction(String functionName, FunctionIndex index) {
			super(functionName);
			this.index = index;
		}

		@Override
		public Object call(DSRuntimeContext ctx, Object[] parameters) throws DSRuntimeException {
			switch(index) {
				case execCommand: {
					if(parameters!=null && parameters.length>=1) {
						for(int i=0; i<parameters.length; i++) {
							Object p = parameters[i];
							if(!(p instanceof String)) {
								throw new DSRuntimeException(null,"execCommand() parameter must be a string");
							}
							ctx.getStdout().println("> "+p);
							int r = CommandList.get().executeCommand(ctx, (String)p);
							ctx.getStdout().println("");
							if(r>0) {
								return r;
							}
						}
						return null;
					}
					throw new DSRuntimeException(null,"execCommand() should take at least one parameter");
				}
			}
			return DSEnvironment.UNHANDLED;
		}
	}
}
