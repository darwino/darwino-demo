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

package com.darwino.app;

import android.app.Application;

import com.darwino.commons.json.JsonException;

/**
 * Android Application
 * 
 */
public class AndroidApplication extends Application {
	
	@Override
	public final void onCreate() {
		super.onCreate();

		// Create the Darwino Application
		try {
			DarwinoApplication.create(this);
		} catch(JsonException ex) {
			throw new RuntimeException("Unable to create Darwino application", ex);
		}
	}
}
