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

package com.darwino.demo.news;

import javax.servlet.ServletContext;

import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.j2ee.resources.JsonDb;
import com.darwino.platform.DarwinoManifest;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class NewsJ2EEApplication extends DarwinoJ2EEApplication {
	
	public NewsJ2EEApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}
	
	@Override
	protected String[] getConfigurationBeanNames(String type) {
		return new String[] {"news","demo",JsonDb.BEAN_LOCAL_NAME,JsonDb.BEAN_DEFAULT_NAME};
	}
}
