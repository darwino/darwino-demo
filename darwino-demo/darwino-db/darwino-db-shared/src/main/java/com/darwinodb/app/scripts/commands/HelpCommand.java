/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands;

import com.darwino.commons.util.QuickSort;
import com.darwino.commons.util.StringUtil;

import picocli.CommandLine.Command;

@Command(name="help",description="List the available commands",mixinStandardHelpOptions = true)
public  class HelpCommand extends AbstractCommand {

	public HelpCommand() {
	}
	
	@Override
	public Integer call() throws Exception {
		CommandList l = CommandList.get();
		Object[] cmds = l.getCommands().keySet().toArray();
		(new QuickSort.ObjectArray(cmds)).sort();
		println("List commands");
		for(int i=0; i<cmds.length; i++) {
			Command cmd = l.getCommands().get(cmds[i]).getAnnotation(Command.class);
			String name = cmd.name();
			String[] description = cmd.description();
			println(StringUtil.format("{0}", name));
			if(description!=null) {
				for(int j=0; j<description.length; j++) {
					println(StringUtil.format("    {0}", description[j]));
				}
			}
		}
		return 0;
	}
}
