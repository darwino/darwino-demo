/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

package com.contacts.app;

import java.util.Locale;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.extensions.ExtensionRegistry;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.platform.DarwinoApplication;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * Application Manifest.
 * 
 * @author Philippe Riand
 */
public class AppManifest extends DarwinoManifest {
	
	public static String CONFIG_ID = "contacts-react";
	
	// This is used by the mobile application to call the remote service
	public static final String MOBILE_PATHINFO	= "contacts-react";
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}

	public static Database getDatabase() throws JsonException {
		return getSession().getDatabase(AppDatabaseDef.DATABASE_NAME);
	}
	

	public AppManifest(Section section) {
		super(section);
	}
	
	@Override
	public String getConfigId() {
		return CONFIG_ID;
	}
	
	@Override
	public String getLabel() {
		return "Contacts React";
	}
	
	@Override
	public String getDescription() {
		return "This is a Darwino auto-generated application";
	}
	
	@Override
	public String getMainPageUrl() {
		if(DarwinoApplication.get().isMobile()) {
			return "assets-mobile/index.html";
		}
		return "index.html";
	}
	
	@Override
	public String[] getDatabases() {
		return AppDatabaseDef.DATABASES;
	}
	
	@Override
	public DatabaseFactory getDatabaseFactory() {
		return new AppDatabaseDef();
	}
	
	@Override
	public ExtensionRegistry getExtensionRegistry() {
		return new AppDBBusinessLogic();
	}

	@Override
	public Locale[] getSupportedLocales() {
		return _locales;
	}
	private Locale[] _locales = new Locale[] {Locale.ENGLISH, Locale.FRENCH};	
}
