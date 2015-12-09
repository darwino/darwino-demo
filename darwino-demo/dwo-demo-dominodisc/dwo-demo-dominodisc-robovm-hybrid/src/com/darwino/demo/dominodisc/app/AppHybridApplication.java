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
import com.darwino.commons.services.HttpServerContext;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridApplication;
import com.darwino.mobile.hybrid.platform.DarwinoHttpServer;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.platform.DarwinoManifest;


public class AppHybridApplication extends DarwinoIOSHybridApplication {
	
	static {
		// Make sure that some classes are referenced and thus loaded
		@SuppressWarnings("unused")
		Class<?> c = AppPlugin.class;
	}
	
	public static AppHybridApplication create() throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			AppHybridApplication app = new AppHybridApplication(
					new AppManifest(new AppMobileManifest(AppManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (AppHybridApplication)AppHybridApplication.get();
	}
	
	public AppHybridApplication(DarwinoManifest manifest) {
		super(manifest);
	}

	@Override
	protected DarwinoHttpServer createHttpServer(HttpServerContext context) {
    	return new AppServiceDispatcher(context);
	}
}
