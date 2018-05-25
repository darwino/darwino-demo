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

package com.darwino.application.jsonstore;

import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.meta.DatabaseFactory;
import com.darwino.platform.DarwinoContext;
import com.darwino.platform.DarwinoManifest;

/**
 * News Application Manifest.
 * 
 * @author Philippe Riand
 */
public class NewsManifest extends DarwinoManifest {
	
	public static String CONFIG_ID = "news";

	public static final String CATEGORY_ALL = "All";
	
	private static final String[] CATEGORIES = new String[]{ 
		CATEGORY_ALL, "Top Stories",  "Politics", "Sports", "Technology", "Science", "Health"
	};
	public static String[] getCategoryLabels() {
		return CATEGORIES;
	}
	public static String getCategoryFilter(int cat) {
		if(cat==0) {
			return null;
		}
		return CATEGORIES[cat];
	}

	public static final String NEWS_DATABASE	= "news";
	public static final String NEWS_STORE		= "news";
	public static final String ATTACHMENT_NAME	= "thumbnail.png";

	public static final String MOBILE_PATHINFO	= "darwino.news";
	
	public static Session getSession() throws JsonException {
		return DarwinoContext.get().getSession();
	}
	
	public static Database getDatabase() throws JsonException {
		return getSession().getDatabase(NEWS_DATABASE);
	}
	
	public static Store getNewsStore() throws JsonException {
		return getDatabase().getStore(NEWS_STORE);
	}

	
	public NewsManifest(Section section) {
		super(section);
	}
	
	@Override
	public String getConfigId() {
		return CONFIG_ID;
	}

	@Override
	public String getLabel() {
		return "News Reader";
	}
	
	@Override
	public String getMainPageUrl() {
		return "news/index.html";
	}
	
	@Override
	public String getDescription() {
		return "Demo application that shows how to create a Darwino application";
	}
	@Override
	public String[] getDatabases() {
		return new String[] { 
			NewsDatabaseDef.DATABASE_NEWS,
		};
	}
	
	@Override
	public DatabaseFactory getDatabaseFactory() {
		return new NewsDatabaseDef();
	}
}
