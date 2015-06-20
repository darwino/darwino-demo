/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
 */

package com.darwino.playground.domino;

import org.eclipse.core.runtime.Plugin;

public class Activator extends Plugin {

	private static Activator plugin;

	public static Activator getDefault() {
		return plugin;
	}
	
	public Activator() {
		plugin = this;
	}
}
