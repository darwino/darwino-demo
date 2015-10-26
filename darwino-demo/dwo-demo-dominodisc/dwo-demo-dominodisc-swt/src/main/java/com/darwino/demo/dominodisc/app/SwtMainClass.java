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

package com.darwino.demo.dominodisc.app;

import com.darwino.commons.json.JsonException;
import com.darwino.swt.platform.hybrid.SwtMain;

/**
 * SWT Application
 */
public class SwtMainClass extends SwtMain {

	@Override
	public String getApplicationId() {
		return "com.darwino.dominodisc";
	}
	
	@Override
	public final void onCreate() {
		super.onCreate();

		// Create the Darwino Application
		try {
			AppHybridApplication.create(this);
		} catch(JsonException ex) {
			throw new RuntimeException("Unable to create Darwino application", ex);
		}
	}
	
	
	public static void main(String[] args) {
		SwtMainClass main = new SwtMainClass();
		main.execute();
	}
}
