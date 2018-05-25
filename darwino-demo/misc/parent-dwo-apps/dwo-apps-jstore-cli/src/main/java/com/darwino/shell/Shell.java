/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.darwino.shell;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.List;

import com.darwino.command.CommandFactory;
import com.darwino.command.Context;
import com.darwino.command.Environment;
import com.darwino.commons.Platform;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.cmd.CommandException;
import com.darwino.commons.util.cmd.CommandLineParameters;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.command.JstoreCommandFactory;
import com.darwino.runtime.command.RuntimeCommandFactory;
import com.darwino.shell.commands.CliCommandFactory;

/**
 * Main command shell.
 * Shell -f <file> -i <file>
 */
public class Shell {

	// Initialization example:
	//    -i myinitfile.dsh
	// Executing a file
	//    -f myfile.dsh
	public static void main(String[] args) {
		try {
			Environment env = new Environment() {
				@Override
				protected void initDefaultFactories(List<CommandFactory> factories) {
					super.initDefaultFactories(factories);
					factories.add(RuntimeCommandFactory.instance);
					factories.add(JstoreCommandFactory.instance);
					factories.add(CliCommandFactory.instance);
				}
			};
			Context ctx = new Context(env);
			try {
				System.out.println(StringUtil.format("Darwino console, version {0}\n",Platform.getDarwinoVersion()));
				
				CommandLineParameters p = new CommandLineParameters(args,new String[]{"f","i"});
				
				// 1- Execute the initialization files
				execDefaultInitFile(ctx);
				execParamInitFile(ctx,p);
				
				// 2- Either execute the file or ask the user
				String file = p.getOption("f");
				if(StringUtil.isNotEmpty(file)) {
					System.out.println(StringUtil.format("Executing file {0}",file));
					// Execute a file and stop
					ctx.execute(new File(file),true);
					System.out.println("");
				} else if(!p.getParams().isEmpty()) {
					System.out.println(StringUtil.format("Executing commands {0}",p.getParams()));
					// Execute the commands
					for(String c: p.getParams()) {
						ctx.execute(c,true);
					}
					System.out.println("");
				} else {
					// Interactive user shell
			        final BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
					while(true) {
						System.out.print(">");
						String cmd = br.readLine().trim();
						if(cmd.equals("quit") || cmd.equals("exit")) {
							break;
						}
						try {
							ctx.execute(cmd,false);
						} catch(Exception ex) {
							Platform.log(ex);
						}
					}
				}
			} finally {
				StreamUtil.close(ctx);
			}
		} catch(Throwable t) {
			Platform.log(t);
		}
	}
	
	protected static void execDefaultInitFile(Context context) throws CommandException {
		String h = System.getProperty("user.home");
		if(StringUtil.isNotEmpty(h)) {
			File darwinoDir = new File(h, ".darwino");
			execInitFile(context, new File(darwinoDir,"console-init.dsh"));
		}
	}
	
	protected static void execParamInitFile(Context context, CommandLineParameters p) throws CommandException {
		String init = p.getOption("i");
		if(StringUtil.isNotEmpty(init)) {
			execInitFile(context, new File(init));
		}
	}
	
	protected static void execInitFile(Context context, File initFile) throws CommandException {
		if(initFile.exists()) {
			System.out.println(StringUtil.format("Initializing with file {0}",initFile.getPath()));
			context.execute(initFile,true);
			System.out.println("");
		}
	}
}