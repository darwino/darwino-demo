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

package com.darwino.demo.news.beans;

import java.io.IOException;
import java.io.Serializable;

import javax.annotation.PreDestroy;
import javax.el.ELContext;
import javax.faces.context.FacesContext;

import com.darwino.commons.json.JsonException;
import com.darwino.j2ee.application.DarwinoJ2EEContext;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.impl.SessionWrapper;


/**
 * Bean associated to the main page.
 * 
 * @author Philippe Riand
 */
//@ManagedBean(name="jsonSession")
//@RequestScoped
public class DatabaseSession extends SessionWrapper implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	private static <T> T findBean(String beanName) {
	    FacesContext context = FacesContext.getCurrentInstance();
	    try {
	    	ELContext elc = context.getELContext();
	    	return (T)elc.getELResolver().getValue(elc, null, beanName);
	    } catch(RuntimeException ex) {
	    	ex.printStackTrace();
	    }
	    return null;
	}	
	
	
	public static Session get() {
		Session s = findBean("jsonSession");
		//PHIL: temp!
		if(s==null) {
			try {
				s = new DatabaseSession();
			} catch (JsonException e) {
				e.printStackTrace();
			}
		}
		return s;
	}
	
	public DatabaseSession() throws JsonException{
		super();
	}

	@Override
	public Session getWrapped() {
		return DarwinoJ2EEContext.get().getSession(); 
	}
	
	@Override
	@PreDestroy
	public void close() {
		try {
			super.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
