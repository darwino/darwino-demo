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

package com.darwino.demo.news.robovm;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridApplication;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.platform.DarwinoManifest;


public class NewsRoboVMHybridApplication extends DarwinoIOSHybridApplication {
	
	public static NewsRoboVMHybridApplication create() throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			NewsRoboVMHybridApplication app = new NewsRoboVMHybridApplication(
					new NewsManifest(new DemoMobileManifest(NewsManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (NewsRoboVMHybridApplication)DarwinoMobileApplication.get();
	}
	
	public NewsRoboVMHybridApplication(DarwinoManifest manifest) {
		super(manifest);
	}
}
