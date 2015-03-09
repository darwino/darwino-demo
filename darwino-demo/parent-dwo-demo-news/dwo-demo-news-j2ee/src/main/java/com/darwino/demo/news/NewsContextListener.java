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

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;

/**
 * Servlet listener that creates the proper Application object.
 * 
 * @author Philippe Riand
 */
public class NewsContextListener extends AbstractDarwinoContextListener {
	
	public NewsContextListener() {
	}
	
	@Override
	protected DarwinoJ2EEApplication createDarwinoApplication(ServletContext context) throws JsonException {
		return new NewsJ2EEApplication(new NewsManifest(null));
	}
}
