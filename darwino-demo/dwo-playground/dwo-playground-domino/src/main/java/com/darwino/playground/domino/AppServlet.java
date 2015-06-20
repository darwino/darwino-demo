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

package com.darwino.playground.domino;

import javax.servlet.ServletContext;

import com.darwino.commons.json.JsonException;
import com.darwino.domino.application.DarwinoApplicationServlet;
import com.darwino.domino.application.DarwinoDominoApplication;



/**
 * Domino Application Servlet.
 * 
 * @author priand
 */
public class AppServlet extends DarwinoApplicationServlet {
	
	private static final long serialVersionUID = 1L;

	public AppServlet() {
	}
	
	@Override
	protected DarwinoDominoApplication createDarwinoApplication(ServletContext servletContext) throws JsonException {
		return DarwinoApplication.create(servletContext);
	}
}
