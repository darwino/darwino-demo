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


import com.darwino.commons.json.JsonException;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridApplication;
import com.darwino.mobile.hybrid.platform.DarwinoHttpServer;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.platform.DarwinoManifest;


public class IOSHybridApplication extends DarwinoIOSHybridApplication {
	
	static {
		// Make sure that some classes are referenced and thus loaded
		@SuppressWarnings("unused")
		Class<?> c = IOSPlugin.class;
	}
	
	public static IOSHybridApplication create() throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			IOSHybridApplication app = new IOSHybridApplication(
					new AppManifest(true,new DarwinoMobileManifest(AppManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (IOSHybridApplication)IOSHybridApplication.get();
	}
	
	public IOSHybridApplication(DarwinoManifest manifest) {
		super(manifest);
	}

	@Override
	protected DarwinoHttpServer createHttpServer(HttpServerContext context) {
    	return new DarwinoServiceDispatcher(context);
	}
}
