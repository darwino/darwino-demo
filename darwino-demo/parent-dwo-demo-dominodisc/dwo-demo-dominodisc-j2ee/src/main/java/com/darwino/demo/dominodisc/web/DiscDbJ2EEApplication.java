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

package com.darwino.demo.dominodisc.web;

import javax.servlet.ServletContext;

import com.darwino.commons.platform.ManagedBeansService;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.platform.DarwinoManifest;

/**
 * J2EE application.
 * 
 * @author Philippe Riand
 */
public class DiscDbJ2EEApplication extends DarwinoJ2EEApplication {
	
	public DiscDbJ2EEApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}
	
	@Override
	public String[] getConfigurationBeanNames() {
		return new String[] {"discdb","demo",ManagedBeansService.LOCAL_NAME,ManagedBeansService.DEFAULT_NAME};
	}
}
