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

package com.darwino.playground.domino;

import com.darwino.commons.security.acl.User;
import com.darwino.commons.security.acl.UserException;
import com.darwino.commons.security.acl.impl.UserImpl;
import com.darwino.commons.security.acl.impl.UserProviderImpl;
import com.darwino.commons.util.StringUtil;
import com.darwino.config.user.UserDirLdap;


/**
 * LDAP access for the playground.
 * 
 * @author Philippe Riand
 */
public class LdapUserDirPlayground extends UserDirLdap {

	// To make the simplified managed bean loader happy (.DominoSchema)
	public static class DominoSchema extends UserDirLdap.DominoSchema {
	}

	
	private static final String EMAIL_DOMAIN		= "@trilog1test.fr";
	private static final String CONNECTIONS_DOMAIN	= "@triloggroup.com";
	
	public LdapUserDirPlayground() {
	}

	@Override
	public String providerUserId(UserImpl user, UserProviderImpl provider) throws UserException {
		// Use the email and transform the organization name
		String email = (String)user.getAttribute(User.ATTR_EMAIL);
		if(StringUtil.isNotEmpty(email)) {
			if(email.endsWith(EMAIL_DOMAIN)) {
				email = email.substring(0, email.length()-EMAIL_DOMAIN.length())+CONNECTIONS_DOMAIN;
				return email.toLowerCase();
			}
		}
		
		return null;
	}	
}
