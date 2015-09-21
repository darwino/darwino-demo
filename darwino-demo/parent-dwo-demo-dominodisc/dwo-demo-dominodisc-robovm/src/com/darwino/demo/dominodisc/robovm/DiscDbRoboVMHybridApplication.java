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

package com.darwino.demo.dominodisc.robovm;

import com.darwino.commons.json.JsonException;
import com.darwino.demo.dominodisc.DiscDbManifest;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridApplication;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileSettings;
import com.darwino.platform.DarwinoManifest;


public class DiscDbRoboVMHybridApplication extends DarwinoIOSHybridApplication {
	
	public static DiscDbRoboVMHybridApplication create() throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			DiscDbRoboVMHybridApplication app = new DiscDbRoboVMHybridApplication(
					new DiscDbManifest(true,new DemoMobileManifest(DiscDbManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (DiscDbRoboVMHybridApplication)DiscDbRoboVMHybridApplication.get();
	}
	
	public DiscDbRoboVMHybridApplication(DarwinoManifest manifest) {
		super(manifest);
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
