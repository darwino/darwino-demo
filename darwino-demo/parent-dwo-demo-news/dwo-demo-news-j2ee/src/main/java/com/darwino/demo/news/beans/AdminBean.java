/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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

import java.io.Serializable;

import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import com.darwino.application.jsonstore.NewsDatabaseDef;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.demo.news.jsonstore.DemoDataLoader;
import com.darwino.j2ee.application.DarwinoJ2EEApplication;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;


/**
 * Bean associated to the main page.
 * 
 * @author Philippe Riand
 */
//@SuppressWarnings("serial")
//@ManagedBean(name="adminBean")
//@RequestScoped
public class AdminBean implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public AdminBean() {
	}
    
    public void recreateDatabase() {
    	try {
        	DarwinoJ2EEApplication.get().initDatabase(NewsDatabaseDef.DATABASE_NEWS, Session.DEPLOY_FORCE);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}
    
    public void deleteAllDocuments() {
    	try {
        	Session jsonSession = DatabaseSession.get();
			jsonSession.getDatabase(NewsDatabaseDef.DATABASE_NEWS).deleteAllDocuments(Store.DELETE_ERASE);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}

    public void createDocuments5() {
    	createDocuments(5);
	}

    public void createDocuments25() {
    	createDocuments(25);
	}

    public void createDocuments100() {
    	createDocuments(100);
	}

    public void createDocuments1000() {
    	createDocuments(1000);
	}

    public void createDocuments10000() {
    	createDocuments(10000);
	}

    public void createDocuments(int count) {
    	try {
        	Session jsonSession = DatabaseSession.get();
        	ServletContext ctx = ((HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest()).getServletContext();
			DemoDataLoader.get().createDocuments(ctx,jsonSession.getDatabase(NewsDatabaseDef.DATABASE_NEWS).getStore(NewsDatabaseDef.STORE_NEWS),count);
		} catch (JsonException e) {
			Platform.log(e);
		}
	}
}
