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

package com.darwino.android.app.dominodisc;

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridApplication;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.log.Logger;
import com.darwino.demo.dominodisc.DiscDbManifest;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.mobile.platform.MobileLogger;
import com.darwino.platform.DarwinoManifest;

import android.app.Application;


public class DiscDbAndroidHybridApplication extends DarwinoAndroidHybridApplication {
	
	public static DiscDbAndroidHybridApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			DiscDbAndroidHybridApplication app = new DiscDbAndroidHybridApplication(
					new DiscDbManifest(true,new DemoMobileManifest(DiscDbManifest.MOBILE_PATHINFO)), 
					application);
			app.init();
		}
		return (DiscDbAndroidHybridApplication)DarwinoMobileApplication.get();
	}
	
	protected DiscDbAndroidHybridApplication(DarwinoManifest manifest, Application application) {
		super(manifest, application);
		// Register the services
		
		// Enable some debug trace
		//MobileLogger.HYBRID_HTTPD.setLogLevel(LogMgr.LOG_INFO_LEVEL);
		MobileLogger.DBSYNC.setLogLevel(Logger.LOG_DEBUG_LEVEL);
		//SocialLogger.DBCACHE.setLogLevel(LogMgr.LOG_DEBUG_LEVEL);
	}
	
	@Override
	public boolean hasCapability(String name) {
		if(CAPABILITY_LOCALSERVICESCACHE.equals(name)) {
			return true;
		}
		return super.hasCapability(name);
	}
	
	@Override
	protected DarwinoMobileSettings createSettings() throws JsonException {
		// Should be shared by Android & iOS
		return new DarwinoMobileSettings() {
			@Override
			public void initDefault(DarwinoManifest mf) {
				super.initDefault(mf);
				this.syncStorageDuration = "3n"; // 3 months
			}
		};
	}
}
