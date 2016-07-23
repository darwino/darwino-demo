/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
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
import com.darwino.commons.util.cmd.CommandLineParameters;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.command.JstoreCommandFactory;
import com.darwino.shell.commands.CliCommandFactory;

/**
 * Main command shell.
 * Shell -f <file> -i <file>
 */
public class Shell {

	// Initialization example:
	//    -i c:\phildev\init-console.dsh
	public static void main(String[] args) {
		try {
			Environment env = new Environment() {
				@Override
				protected void initDefaultFactories(List<CommandFactory> factories) {
					super.initDefaultFactories(factories);
					factories.add(JstoreCommandFactory.instance);
					factories.add(CliCommandFactory.instance);
				}
			};
			Context ctx = env.createContext();
			try {
				System.out.println(StringUtil.format("Darwino console, version {0}\n",Platform.getDarwinoVersion()));
				
				CommandLineParameters p = new CommandLineParameters(args,new String[]{"f","i"});
				
				String init = p.getOption("i");
				
				// 1- Execute the initialization file
				if(StringUtil.isNotEmpty(init)) {
					System.out.println(StringUtil.format("Initializing file {0}",init));
					ctx.execute(new File(init),true);
					System.out.println("");
				}
				
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
}