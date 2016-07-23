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

package com.darwino.shell.commands;

import java.io.PrintWriter;
import java.io.Reader;
import java.util.Set;

import com.darwino.command.Command;
import com.darwino.command.Context;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.cmd.CommandException;
import com.darwino.commons.util.cmd.CommandLineParameters;
import com.darwino.shell.extensions.ConfigExtension;

/**
 * Load config command.
 */
public class LoadConfigCommand extends Command {
	
	public LoadConfigCommand() {
		super(
			"load-config",
			"Loads configuration files (beans & properties)",
			 "load-config\n  Lists the configuration directories being used\n"
			+"load-config [<dir>]]\n  Loads darwino.properties and darwino-beans.xml from the directory"
		);
	}
	
	@Override
	public void execute(Context context, PrintWriter pw, Reader r, String params) throws CommandException {
		CommandLineParameters p = new CommandLineParameters(params);
		String dir = p.getParam(0);
		if(StringUtil.isNotEmpty(dir)) {
			ConfigExtension.instance.addDirectory(dir);
		}
		
		Set<String> dirs = ConfigExtension.instance.getDirectories();
		for(String d: dirs) {
			pw.println(d);
		}
	}
}
