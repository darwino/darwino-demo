/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app;

import com.darwino.commons.microservices.StaticJsonMicroServicesFactory;
import com.darwinodb.app.microservices.ListScripts;
import com.darwinodb.app.microservices.LoadScript;
import com.darwinodb.app.microservices.ReadDarwinoBean;
import com.darwinodb.app.microservices.ReadDarwinoProperties;
import com.darwinodb.app.microservices.RunSql;
import com.darwinodb.app.microservices.SqlObjects;
import com.darwinodb.app.microservices.TreeView;


/**
 * Application Micro Services Factory.
 * 
 * This is the place to define custom application micro services.
 */
public class AppMicroServicesFactory extends StaticJsonMicroServicesFactory {
	
	public AppMicroServicesFactory() {
		add(TreeView.NAME, new TreeView());
		add(ListScripts.NAME, new ListScripts());
		add(LoadScript.NAME, new LoadScript());
		add(RunSql.NAME, new RunSql());
		
		add(ReadDarwinoBean.NAME, new ReadDarwinoBean());
		add(ReadDarwinoProperties.NAME, new ReadDarwinoProperties());

		add(SqlObjects.NAME, new SqlObjects());
	}
}
