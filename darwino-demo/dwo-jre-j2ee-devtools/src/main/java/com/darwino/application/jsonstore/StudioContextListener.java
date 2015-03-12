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

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.j2ee.application.AbstractDarwinoContextListener;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;

/**
 * Servlet context listener for initializing the Studio application.
 * 
 * @author Philippe Riand
 */
public class StudioContextListener extends AbstractDarwinoContextListener {
	
	public StudioContextListener() {
	}
	
	@Override
	protected DarwinoJ2EEApplication createDarwinoApplication(ServletContext context) throws JsonException {
		return new StudioJ2EEApplication(new StudioManifest());
	}
}
