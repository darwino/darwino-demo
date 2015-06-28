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

package com.darwino.playground.domino;

import javax.servlet.ServletContext;

import org.osgi.framework.Bundle;

import com.darwino.commons.json.JsonException;
import com.darwino.config.jsonstore.JsonDb;
import com.darwino.domino.application.DarwinoDominoApplication;
import com.darwino.platform.DarwinoManifest;
import com.darwino.playground.app.AppManifest;


/**
 * Domino application.
 * 
 * @author Philippe Riand
 */
public class DarwinoApplication extends DarwinoDominoApplication {
	
	public static DarwinoDominoApplication create(ServletContext context) throws JsonException {
		if(!DarwinoDominoApplication.isInitialized()) {
			DarwinoApplication app = new DarwinoApplication(
					context,
					new AppManifest(true,new AppDominoManifest())
			);
			app.init();
		}
		return DarwinoDominoApplication.get();
	}
	
	protected DarwinoApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}

	@Override
	public Bundle getBundle() {
		return Activator.getDefault().getBundle();
	}

	@Override
	public String[] getResourcesBundleNames() {
		return new String[] {
			"com.darwino.playground.domino",
			"com.darwino.playground.webui",
			"com.darwino.web.darwino"
		};
	}
	
	@Override
	public String[] getConfigurationBeanNames(String type) {
		return new String[] {"Playground",JsonDb.BEAN_LOCAL_NAME,JsonDb.BEAN_DEFAULT_NAME};
	}
}
