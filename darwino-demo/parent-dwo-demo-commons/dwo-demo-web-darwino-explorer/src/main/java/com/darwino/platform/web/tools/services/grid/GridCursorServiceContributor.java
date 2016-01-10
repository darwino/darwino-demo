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

package com.darwino.platform.web.tools.services.grid;

import java.util.List;

import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.rest.RestServiceBinder;
import com.darwino.commons.services.rest.RestServiceFactory;
import com.darwino.jsonstore.Index;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.services.JsonStoreServiceContributor;
import com.darwino.jsonstore.services.JsonStoreServiceFactory;


/**
 * Dispatcher for the Json store REST services.
 * 
 * Should we separate this class into to two classes and share it for multiple service implementations?
 * 
 * @author priand
 */
public class GridCursorServiceContributor extends JsonStoreServiceContributor {
	
	public static final String	PREFIX = "ui";

	public GridCursorServiceContributor(JsonStoreServiceFactory factory) {
		super(factory);
	}
	
	//
	// Supported services
	//
	@Override
	public void createServicesBinders(RestServiceFactory factory, List<RestServiceBinder> binders) {
		/////////////////////////////////////////////////////////////////////////////////
		// INFORMATION
		//    Information
		//		ui/grid/databases/{database_id}/stores/{store_id}/entries [instance=xxxx]
		//		ui/grid/databases/{database_id}/stores/{store_id}/indexes/{index_id}/entries [instance=xxxx]
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"entries","w2uigrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				return new W2uiGridCursorService(store, null);
			}
		});
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"indexes",null,"entries","w2uigrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				Index index = getIndex(store,parts[7]);
				return new W2uiGridCursorService(store, index);
			}
		});
		
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"entries","jqgrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				return new JqGridCursorService(store, null);
			}
		});
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"indexes",null,"entries","jqgrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				Index index = getIndex(store,parts[7]);
				return new JqGridCursorService(store, index);
			}
		});
		
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"entries","nguigrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				return new NgUiGridCursorService(store, null);
			}
		});
		binders.add(new RestServiceBinder(PREFIX,"grid","databases",null,"stores",null,"indexes",null,"entries","nguigrid") {
			@Override
			public HttpService createService(HttpServiceContext context, String[] parts) {
				Store store = getStore(context,parts[3],parts[5]);
				Index index = getIndex(store,parts[7]);
				return new NgUiGridCursorService(store, index);
			}
		});
	}
}
