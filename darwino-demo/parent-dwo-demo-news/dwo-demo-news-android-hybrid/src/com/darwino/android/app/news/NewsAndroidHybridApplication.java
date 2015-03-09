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

package com.darwino.android.app.news;

import android.app.Application;

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridApplication;
import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.platform.DarwinoManifest;


public class NewsAndroidHybridApplication extends DarwinoAndroidHybridApplication {
	
	public static NewsAndroidHybridApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			NewsAndroidHybridApplication app = new NewsAndroidHybridApplication(
					new NewsManifest(new DemoMobileManifest(NewsManifest.MOBILE_PATHINFO)), 
					application);
			app.init();
		}
		return (NewsAndroidHybridApplication)get();
	}
	
	protected NewsAndroidHybridApplication(DarwinoManifest manifest, Application application) {
		super(manifest, application);
	}
}
