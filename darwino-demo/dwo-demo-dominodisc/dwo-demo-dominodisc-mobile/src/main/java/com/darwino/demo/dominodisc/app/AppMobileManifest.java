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

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.sql.impl.sqlite.SqliteDatabaseCustomizer;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.mobile.platform.DarwinoMobileSettings;

/**
 * Mobile Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppMobileManifest extends DarwinoMobileManifest {
	
	public AppMobileManifest(String pathInfo) {
		super(pathInfo);
	}
	
	@Override
	public void initDefaultSettings(DarwinoMobileSettings settings) {
		super.initDefaultSettings(settings);
		settings.getJson().putString("syncStorageDuration", "3n"); // 3 months
	}

	@Override
	public SqliteDatabaseCustomizer findDatabaseCustomizer(String dbName) throws JsonException {
		return new AppDatabaseCustomizer();
	}
	
}
