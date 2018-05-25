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
