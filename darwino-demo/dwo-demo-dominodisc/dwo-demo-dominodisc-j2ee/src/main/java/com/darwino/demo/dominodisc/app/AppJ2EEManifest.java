/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
