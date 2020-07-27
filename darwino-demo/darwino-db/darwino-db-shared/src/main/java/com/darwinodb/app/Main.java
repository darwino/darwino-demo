/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import java.io.File;

/**
 * Main Entry Point.
 */
public abstract class Main implements Runnable {
	
	private static Main main = null;
	public static final Main get() {
		if(main==null) {
			throw new IllegalStateException();
		}
		return main;
	}
	
	protected Main() {
		Main.main = this;
	}
	
	public abstract File getConfigDir();
	public abstract File getFilesDir();
}
