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

package com.example.android.newsreader.db;

import com.darwino.commons.json.JsonException;

import android.app.Application;

public class NewsAndroidApplication extends Application {

	@Override
	public final void onCreate() {
		super.onCreate();

        // Create the database
		// Local environment & remote one
        // This should be optimized by initializing lazily!
		try {
			NewsAndroidNativeApplication.create(this);
		} catch(JsonException ex) {
			throw new RuntimeException("Unable to create Darwino application", ex);
		}
	}
}
