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

import com.darwino.commons.platform.ManagedBeansService;
import com.darwino.j2ee.application.DarwinoJ2EEManifest;

/**
 * J2EE Application Manifest.
 * 
 * @author Philippe Riand
 */
public class NewsJ2EEManifest extends DarwinoJ2EEManifest {
	
	public NewsJ2EEManifest() {
	}

	/**
	 * Bean aliases.
	 */
	@Override
	public String[] getConfigurationBeanNames() {
		return new String[] {"news",ManagedBeansService.LOCAL_NAME,ManagedBeansService.DEFAULT_NAME};
	}
}
