/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

package com.darwinodb.app.platform;

import com.darwino.commons.Platform;
import com.darwino.commons.util.security.PasswordHash;
import com.darwino.commons.util.security.PasswordHashMD5;



/**
 * Managed Bean extension for a default server installation.
 * 
 * @author Philippe Riand
 */
public class AppPasswordHash {

	static PasswordHash passwordHash;
	static {
		String salt = "DaRwINOdb2020@Salty%389#";
		passwordHash = new PasswordHashMD5(salt);
	}
	
	public static PasswordHash get() {
		return passwordHash;
	}
	
	public static void main(String[] args) {
		try {
			String[] passwords = args;
			if(passwords.length==0) {
				passwords = new String[]{"darwino"};
			}
			for(int i=0; i<passwords.length; i++) {
				String p = passwords[i];
				String hp = passwordHash.hash(p);
				Platform.log("{0}={1}",p,hp);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}