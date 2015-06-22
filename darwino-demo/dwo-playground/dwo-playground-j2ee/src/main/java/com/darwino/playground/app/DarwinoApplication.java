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

package com.darwino.playground.app;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.config.jsonstore.JsonDb;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jre.application.DarwinoJreApplication;
import com.darwino.platform.DarwinoManifest;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class DarwinoApplication extends DarwinoJ2EEApplication {
	
	public static DarwinoJreApplication create(ServletContext context) throws JsonException {
		if(!DarwinoJreApplication.isInitialized()) {
			DarwinoApplication app = new DarwinoApplication(
					context,
					new AppManifest(true,new AppJ2EEManifest())
			);
			app.init();
		}
		return DarwinoJreApplication.get();
	}
	
	protected DarwinoApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}
	
	@Override
	public String[] getConfigurationBeanNames(String type) {
		return new String[] {"Playground",JsonDb.BEAN_LOCAL_NAME,JsonDb.BEAN_DEFAULT_NAME};
	}
}
