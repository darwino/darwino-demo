/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts;

import com.darwino.script.DSEnvironment;
import com.darwino.script.library.JavaReflectionLibrary;
import com.darwino.script.library.StandardLibrary;

/**
 * Script environment for the tasks
 */
public class ScriptsEnvironment extends DSEnvironment {
		 
	public static ScriptsEnvironment instance = new ScriptsEnvironment();

	public ScriptsEnvironment() {
		registerLibrary(new StandardLibrary());
		registerLibrary(new JavaReflectionLibrary(this));
		registerLibrary(new ScriptsFunctionLibrary());
	}
	
	@Override
	protected int getCacheSize() {
		// No cache!
		return 0;
	}
}
