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

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridApplication;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.log.Logger;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.mobile.hybrid.platform.DarwinoHttpServer;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.MobileLogger;
import com.darwino.platform.DarwinoManifest;


public class DarwinoApplication extends DarwinoAndroidHybridApplication {
	
	public static DarwinoApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			DarwinoApplication app = new DarwinoApplication(
					new AppManifest(true,new AppMobileManifest(AppManifest.MOBILE_PATHINFO)), 
					application);
			app.init();
		}
		return (DarwinoApplication)DarwinoMobileApplication.get();
	}
	
	protected DarwinoApplication(DarwinoManifest manifest, Application application) {
		super(manifest, application);

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
	protected DarwinoHttpServer createHttpServer(HttpServerContext context) {
    	return new DarwinoServiceDispatcher(context);
	}
}
