/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.files;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.darwino.commons.util.QuickSort;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.commands.AbstractCommand;

import picocli.CommandLine.Command;

@Command(name="list-files",description="List the files uploaded to the server",mixinStandardHelpOptions = true)
public  class ListFilesCommand extends AbstractCommand {

	public ListFilesCommand() {
	}
	
	
	@Override
	public Integer call() throws Exception {
		File filesDir = Main.get().getFilesDir();
		
		List<String> files = new ArrayList<String>();
		addFiles(files,filesDir,"");
		
		(new QuickSort.JavaList(files)).sort();
		
		println("List of files ({0}), directory: {1}",files.size(),filesDir.getPath());
		for(String s: files) {
			println("    {0}", s);
		}
		
		return 0;
	}
	
	private void addFiles(List<String> list, File dir, String base) {
		File[] all = dir.listFiles();
		if(all!=null) {
			for(int i=0; i<all.length; i++) {
				File f = all[i];
				String path = base+File.separator+f.getName();
				if(f.isDirectory()) {
					addFiles(list,f,path);
				} else if(f.isFile()) {
					list.add(path);
				}
			}
		}
	}
}
