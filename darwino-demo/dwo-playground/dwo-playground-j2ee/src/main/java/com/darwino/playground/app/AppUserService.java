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

package com.darwino.playground.app;

import com.darwino.commons.util.StringUtil;
import com.darwino.j2ee.resources.services.DarwinoJ2EEUserService;

/**
 * Create a user service for this app.
 * 
 * @author Philippe Riand
 */
public class AppUserService extends DarwinoJ2EEUserService {

	@Override
	public boolean checkUserPassword(String userName, String password) {
		if(StringUtil.equals(password,"darwino")) {
			return true;
		}
		return false;
	}
}
