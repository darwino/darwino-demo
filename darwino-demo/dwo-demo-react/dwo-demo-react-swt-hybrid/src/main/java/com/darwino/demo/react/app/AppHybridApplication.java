/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.react.app;


import com.darwino.commons.json.JsonException;
import com.darwino.commons.log.Logger;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.mobile.hybrid.platform.DarwinoMobileHttpServer;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.MobileLogger;
import com.darwino.platform.DarwinoManifest;
import com.darwino.swt.Application;
import com.darwino.swt.platform.hybrid.DarwinoSwtHybridApplication;


public class AppHybridApplication extends DarwinoSwtHybridApplication {
	
	public static AppHybridApplication create(Application application) throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			AppHybridApplication app = new AppHybridApplication(
					new AppManifest(new AppMobileManifest(AppManifest.MOBILE_PATHINFO) {
						// Disable encryption as it is not available on SWT yet
						@Override
						public boolean isDataEncryptedByDefault() {
							return false;
						}
					}), 
					application);
			app.init();
		}
		return (AppHybridApplication)AppHybridApplication.get();
	}
	
	protected AppHybridApplication(DarwinoManifest manifest, Application application) {
		super(manifest, application);

		// Enable some debug trace
		//MobileLogger.HYBRID_HTTPD.setLogLevel(LogMgr.LOG_INFO_LEVEL);
		MobileLogger.DBSYNC.setLogLevel(Logger.LOG_DEBUG_LEVEL);
		//SocialLogger.DBCACHE.setLogLevel(LogMgr.LOG_DEBUG_LEVEL);
	}

	@Override
	protected DarwinoMobileHttpServer createHttpServer(HttpServerContext context) {
    	return new AppServiceDispatcher(context);
	}
}
