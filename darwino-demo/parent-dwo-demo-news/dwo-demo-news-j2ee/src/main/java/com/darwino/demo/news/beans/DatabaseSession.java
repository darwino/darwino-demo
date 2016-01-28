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

package com.darwino.demo.news.beans;

import java.io.IOException;
import java.io.Serializable;

import javax.annotation.PreDestroy;
import javax.el.ELContext;
import javax.faces.context.FacesContext;

import com.darwino.commons.Platform;
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
	    	Platform.log(ex);
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
				Platform.log(e);
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
			Platform.log(e);
		}
	}
}
