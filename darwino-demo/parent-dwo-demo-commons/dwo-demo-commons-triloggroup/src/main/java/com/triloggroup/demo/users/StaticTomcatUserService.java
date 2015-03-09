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

package com.triloggroup.demo.users;

import java.util.ArrayList;
import java.util.List;

import com.darwino.commons.security.acl.User;
import com.darwino.commons.security.acl.UserException;
import com.darwino.commons.security.acl.UserService;
import com.darwino.commons.security.acl.impl.UserImpl;


/**
 * User directory service for the trilog demo organizaion when used from a TOMCAT
 * environment without a true LDAP connection.
 * 
 * The tomcat-users.xml file should be filled accordingly:
	  <user password="floflo" roles="peuser" username="atinov"/>
	  <user password="floflo" roles="peuser" username="amass"/>
	  <user password="floflo" roles="peuser" username="aboucher"/>
	  <user password="floflo" roles="peuser" username="acalder"/>
	  <user password="floflo" roles="peuser" username="agardner"/>
	  <user password="floflo" roles="peuser" username="bchapot"/>
	  <user password="floflo" roles="peuser" username="blemercier"/>
	  <user password="floflo" roles="peuser" username="bchris"/>
	  <user password="floflo" roles="peuser" username="bbright"/>
	  <user password="floflo" roles="peuser" username="larmatti"/>
	  <user password="floflo" roles="peuser" username="lbros"/>
	  <user password="floflo" roles="peuser" username="mdavis"/>
	  <user password="floflo" roles="peuser" username="pcollins"/>
	  <user password="floflo" roles="peuser" username="rjordan"/>
 */
public class StaticTomcatUserService implements UserService {
	
	private static final class StaticUser extends UserImpl {
		private String userId;
		private String email;
		StaticUser(String dn, String cn, String userId, String email) {
			super(dn, cn, null, null);
			this.userId = userId;
			this.email = email;
		}
		@Override
		public String getAttribute(String attrName) {
			if(ATTR_USERID.equals(attrName)) {
				return userId;
			}
			if(ATTR_EMAIL.equals(attrName)) {
				return email;
			}
			return super.getAttribute(attrName);
		}
	}
	
	
	public static final List<StaticUser> trilogUsers;
	static {
		trilogUsers = new ArrayList<StaticUser>();
		trilogUsers.add(new StaticUser("cn=phil,o=triloggroup", "Phil", "phil", "phil@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=jesse,o=darwino", "Jesse", "jesse", "jesse@darwino.com"));

		trilogUsers.add(new StaticUser("cn=adam tinov,o=triloggroup", "Adam Tinov", "atinov", "atinov@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=al mass,o=triloggroup", "Al Mass", "amass", "amass@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=alain boucher,o=triloggroup", "Alain Boucher", "aboucher", "aboucher@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=amanda calder,o=triloggroup", "Amanda Calder", "acalder", "acalder@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=ava gardner,o=triloggroup", "Ava Gardner", "agardner", "agardner@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=bernard chapot,o=triloggroup", "Bernard Chapot", "bchapot", "bchapot@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=bernard lemercier,o=triloggroup", "Bernard Lemercier", "blemercier", "blemercier@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=betty chris,o=triloggroup", "Betty Chris", "bchris", "bchris@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=bill bright,o=triloggroup", "Bill Bright", "bbright", "bbright@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=lauren armatti,o=triloggroup", "Lauren Armatti", "larmatti", "larmatti@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=leon bros,o=triloggroup", "Leon Bros", "lbros", "lbros@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=mary davis,o=triloggroup", "Mary Davis", "mdavis", "mdavis@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=philip collins,o=triloggroup", "Philip Collins", "pcollins", "pcollins@triloggroup.com"));
		trilogUsers.add(new StaticUser("cn=ralf jordan,o=triloggroup", "Ralf Jordan", "rjordan", "rjordan@triloggroup.com"));
		

		//trilogUsers.add(new StaticUser("cn=xxxxx,o=triloggroup", "xxxxx", "xxxxx", "xxxxx@triloggroup.com"));
	}

	@Override
	public User findUser(String id) throws UserException {
		if(id.startsWith("cn=")) {
			return findUserByDn(id);
		}
		if(id.indexOf('@')>=0) {
			return findUserByEmail(id);
		}
		return findUserById(id);
	}
	
	protected User findUserById(String id) throws UserException {
		int count = trilogUsers.size();
		for(int i=0; i<count; i++) {
			StaticUser u = trilogUsers.get(i);
			if(id.equalsIgnoreCase(u.userId)) {
				return u;
			}
		}
		return null;
	}
	
	protected User findUserByDn(String dn) throws UserException {
		int count = trilogUsers.size();
		for(int i=0; i<count; i++) {
			StaticUser u = trilogUsers.get(i);
			if(dn.equalsIgnoreCase(u.getDistinguishedName())) {
				return u;
			}
		}
		return null;
	}
	
	protected User findUserByEmail(String email) throws UserException {
		int count = trilogUsers.size();
		for(int i=0; i<count; i++) {
			StaticUser u = trilogUsers.get(i);
			if(email.equalsIgnoreCase(u.email)) {
				return u;
			}
		}
		return null;
	}
}
