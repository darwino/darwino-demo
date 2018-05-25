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
