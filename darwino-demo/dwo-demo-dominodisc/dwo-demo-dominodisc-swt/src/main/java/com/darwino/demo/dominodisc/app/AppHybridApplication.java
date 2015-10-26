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
import com.darwino.commons.log.Logger;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.jsonstore.sql.impl.sqlite.SqliteDatabaseCustomizer;
import com.darwino.mobile.hybrid.platform.DarwinoHttpServer;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.MobileLogger;
import com.darwino.platform.DarwinoManifest;
import com.darwino.swt.Application;
import com.darwino.swt.platform.hybrid.DarwinoSwtHybridApplication;


public class AppHybridApplication extends DarwinoSwtHybridApplication {
	
	public static AppHybridApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			AppHybridApplication app = new AppHybridApplication(
					new AppManifest(new AppMobileManifest(AppManifest.MOBILE_PATHINFO)), 
					application);
			app.init();
		}
		return (AppHybridApplication)DarwinoMobileApplication.get();
	}
	
	protected AppHybridApplication(DarwinoManifest manifest, Application application) {
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

/*
 * Uncomment if you want to initialize the default settings
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
*/	

	@Override
	protected SqliteDatabaseCustomizer findDatabaseCustomizer(String dbName) throws JsonException {
		return new AppDatabaseCustomizer();
	}

	@Override
	protected DarwinoHttpServer createHttpServer(HttpServerContext context) {
    	return new AppServiceDispatcher(context);
	}
}
