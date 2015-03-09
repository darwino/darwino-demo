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

import android.app.Application;

import com.darwino.android.platform.anative.DarwinoAndroidNativeApplication;
import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.platform.DarwinoManifest;


public class NewsAndroidNativeApplication extends DarwinoAndroidNativeApplication {
	
	public static NewsAndroidNativeApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			NewsAndroidNativeApplication app = new NewsAndroidNativeApplication(
					new NewsManifest(new DemoMobileManifest(NewsManifest.MOBILE_PATHINFO)), 
					application);
			app.init();
		}
		return (NewsAndroidNativeApplication)get();
	}
	
	public NewsAndroidNativeApplication(DarwinoManifest manifest, Application application) {
		super(manifest, application);
	}
}
