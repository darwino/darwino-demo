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

package com.darwino.demo.dominodisc.app;

import com.darwino.commons.platform.ManagedBeansService;
import com.darwino.j2ee.application.DarwinoJ2EEManifest;
import com.darwino.jsonstore.sql.impl.full.JdbcDatabaseCustomizer;
import com.darwino.sql.drivers.DBDriver;

/**
 * J2EE Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppJ2EEManifest extends DarwinoJ2EEManifest {
	
	public AppJ2EEManifest() {
	}

	/**
	 * Bean aliases.
	 */
	@Override
	public String[] getConfigurationBeanNames() {
		return new String[] {"discdb",ManagedBeansService.LOCAL_NAME,ManagedBeansService.DEFAULT_NAME};
	}
	
	/**
	 * Database customizer.
	 */
	@Override
	public JdbcDatabaseCustomizer findDatabaseCustomizerFactory(DBDriver driver, String dbName) {
		return new AppDatabaseCustomizer(driver); 
	}
	
	/**
	 * Properties to push down to the device
	 */
	@Override
	protected String[] getMobilePushedPropertyKeys() {
		return new String[] {
			"discdb.instances"
		};
	}
}
