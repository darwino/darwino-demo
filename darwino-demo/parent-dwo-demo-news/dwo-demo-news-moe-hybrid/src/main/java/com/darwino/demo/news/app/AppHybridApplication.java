/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.news.app;


import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.services.HttpServerContext;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridApplication;
import com.darwino.mobile.hybrid.platform.DarwinoMobileHttpServer;
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
					new NewsManifest(new DemoMobileManifest(NewsManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (AppHybridApplication)DarwinoMobileApplication.get();
	}
	
	public AppHybridApplication(DarwinoManifest manifest) {
		super(manifest);
	}

	@Override
	protected DarwinoMobileHttpServer createHttpServer(HttpServerContext context) {
    	return new AppServiceDispatcher(context);
	}
}
