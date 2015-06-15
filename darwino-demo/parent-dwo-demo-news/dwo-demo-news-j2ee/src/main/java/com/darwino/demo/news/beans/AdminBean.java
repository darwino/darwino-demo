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
        	DarwinoJ2EEApplication.get().initDatabase(NewsDatabaseDef.DATABASE_NEWS, true);
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
