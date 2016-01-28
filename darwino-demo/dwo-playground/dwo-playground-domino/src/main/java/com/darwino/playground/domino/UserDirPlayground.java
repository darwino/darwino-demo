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
