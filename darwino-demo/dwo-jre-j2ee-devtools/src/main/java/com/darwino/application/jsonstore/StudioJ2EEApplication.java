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

package com.darwino.application.jsonstore;

import javax.servlet.ServletContext;

import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.j2ee.resources.JsonDb;
import com.darwino.platform.DarwinoManifest;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class StudioJ2EEApplication extends DarwinoJ2EEApplication {
	
	public StudioJ2EEApplication(ServletContext context,DarwinoManifest manifest) {
		super(context,manifest);
	}
	
	@Override
	protected String[] getConfigurationBeanNames(String type) {
		return new String[] {"demo",JsonDb.BEAN_LOCAL_NAME,JsonDb.BEAN_DEFAULT_NAME};
	}
}
