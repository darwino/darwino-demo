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

package com.darwinodb.app.beans;

import com.darwino.commons.Platform;
import com.darwino.commons.httpclnt.HttpConnection;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.platform.beans.ManagedBeansExtension;
import com.darwino.commons.util.StringUtil;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.LocalJsonDBServer;
import com.darwino.jsonstore.Session;
import com.darwinodb.app.AppDatabaseDef;

/**
 * Database Managed Bean Factory.
 *
 * The beans are created out of database document.
 *  
 * @author Philippe Riand
 */
public class HttpConnectionBeanExtension extends AbstractDatabaseBeanExtension {
	
	public class DBHttpConnection extends HttpConnection {		
	}

	public class ConnectionBeanFactory extends DatabaseBeanFactory {
		
		private String url;
		private String user;
		private String password;
		
		public ConnectionBeanFactory(String name, String url, String user, String password) {
			super(ManagedBeansExtension.SCOPE_GLOBAL,name);
			this.url = url;
			this.user = user;
			this.password = password;
		}
		
		@Override
		public Object createInstance(ClassLoader classloader, Class<?> defaultClass) {
			HttpConnection c = new DBHttpConnection();
			c.setUrl(url);
			c.setUser(user);
			c.setPassword(password);
			return c;
		}
	}

	public HttpConnectionBeanExtension() {
	}

	@Override
	public BeanFactory getFactory(String type, String name) {
		if(StringUtil.equals(type,HttpConnection.BEAN_TYPE)) {
			return createConnectionBeanFactory(name);
		}
		return null;
	}
	
	protected ConnectionBeanFactory createConnectionBeanFactory(String name) {
		JsonObject doc = loadDocument(AppDatabaseDef.DATABASE_NAME, "connections", name);
		if(doc!=null) {
			String url = doc.getString("url");
			String user = doc.getString("user");
			String password = doc.getString("password");
			return new ConnectionBeanFactory(name,url,user,password);
		}
		return null;
	}

	protected JsonObject loadDocument(String database, String store, String name) {
		try {
			Session session = ((LocalJsonDBServer)getJsonDBServer()).createSystemSession(null);
			try {
				//Document doc = session.getDatabase(database).getStore(store).loadDocument(unid,Document.DOCUMENT_NULL);
				Document doc = session.getDatabase(database).getStore(store).openCursor()
//								.query("{name:'${n}'}")
//								.param("n", name)
								.query("{name:'"+name+"'}")
								.findOneDocument();
				if(doc!=null) {
					return (JsonObject)doc.getJson();
				}
			} finally {
				StreamUtil.close(session);
			}
		} catch(JsonException ex) {
			Platform.log(ex);
		}
		return null;
	}

}
