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
