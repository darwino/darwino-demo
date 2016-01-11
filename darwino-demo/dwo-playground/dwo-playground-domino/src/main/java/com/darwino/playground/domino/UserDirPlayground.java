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

import com.darwino.commons.util.StringUtil;
import com.darwino.domino.resources.UserDirDomino;


/**
 * DN fixer for Domino between darwino and triloggroup domains.
 * 
 * @author Philippe Riand
 */
public class UserDirPlayground extends UserDirDomino {
	
	public UserDirPlayground() {
	}

	@Override
	public String fixDn(String provider, String dn) {
		// Domino directory fix
		if(StringUtil.isEmpty(provider)) {
			// Fix DNs, with Darwino
			// cn=al mass,o=triloggroup
			// cn=al mass,o=darwino
			if(StringUtil.endsWithIgnoreCase(dn, "o=triloggroup")) { //$NON-NLS-1$
				return dn.substring(0,dn.length()-"o=triloggroup".length())+"o=darwino"; //$NON-NLS-1$ //$NON-NLS-2$
			}
			return dn;
		}
		
		// IBM Connections
		// A darwino email should be transformed to a triloggroup one
		if(StringUtil.equals(provider,"connections")) { //$NON-NLS-1$
			if(StringUtil.endsWithIgnoreCase(dn, "@darwino.com")) { //$NON-NLS-1$
				return dn.substring(0,dn.length()-"@darwino.com".length())+"@triloggroup.com"; //$NON-NLS-1$ //$NON-NLS-2$
			}
			return dn;
		}
		
		return dn;
	}
	
}
