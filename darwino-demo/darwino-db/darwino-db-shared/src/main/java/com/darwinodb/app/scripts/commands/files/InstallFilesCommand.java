/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.files;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.darwino.commons.Platform;
import com.darwino.commons.util.PathUtil;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.script.DSRuntimeException;
import com.darwinodb.app.Main;
import com.darwinodb.app.scripts.commands.AbstractCommand;

import picocli.CommandLine.Command;
import picocli.CommandLine.Option;

@Command(name="install-files",description="Install the files related to a package, like a demo",mixinStandardHelpOptions = true)
public  class InstallFilesCommand extends AbstractCommand {

	@Option(names = {"-p", "--package"}, description = "Package Name")
	public String name;

// Future extension if we want to download demo content
//	@Option(names = {"-u", "--url"}, description = "Server URL for the demo")
//	public String database;

	public InstallFilesCommand() {
	}
	
	
	@Override
	public Integer call() throws Exception {
		File filesDir = Main.get().getFilesDir();
		
		if(StringUtil.isEmpty(name)) {
			throw new DSRuntimeException(null,"The name of the package is empty");
		}
		
		if(name.equals("contacts")) {
			copy(filesDir, "contacts", "contacts.database.json");
			copy(filesDir, "contacts", "contacts.zip");
		}

		println("Installed files for package {0}",name);

		return 0;
	}
	
	private void copy(File fileDir, String dir, String name) throws IOException {
		InputStream is = getClass().getClassLoader().getResourceAsStream(PathUtil.concat("demo",dir,name));
		try {
			File f = new File(fileDir,name);
			f.getParentFile().mkdirs();
			OutputStream os = new FileOutputStream(f);
			try {
				StreamUtil.copyStream(is, os);
				Platform.log("    Installed file: {0}, {1} bytes",name,f.length());
			} finally {
				StreamUtil.close(os);
			}
		} finally {
			StreamUtil.close(is);
		}
	}
}
