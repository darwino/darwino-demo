package com.darwino.services.rest;

import com.darwino.app.AppDatabaseDef;
import com.darwino.commons.json.JsonArray;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.services.HttpService;
import com.darwino.commons.services.HttpServiceContext;
import com.darwino.commons.services.HttpServiceError;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;
import com.darwino.platform.DarwinoContext;

public class ResourcesRest extends HttpService {
	
	private String resourceId;
	
	public ResourcesRest() {
		this.resourceId = null;
	}
	public ResourcesRest(String resourceId) {
		this.resourceId = resourceId;
	}
	
	@Override
	public void service(HttpServiceContext context) {
		if(context.isGet()) {
			processGET(context);
		} else if(context.isPost()) {
			processPOST(context);
		} else {
			throw HttpServiceError.errorUnsupportedMethod(context.getMethod());
		}
	}
	
	public void processGET(final HttpServiceContext context) {
		JsonObject o = new JsonObject();
		try {
			Store store = getResourcesStore();
			if (this.resourceId != null) {
//				o.put("resourceId", this.resourceId);
				Document doc = store.loadDocument(resourceId);
				o.copyFrom(JsonObject.fromJson(doc.getJsonString()));	// TODO : plus simple ?
			} else {
				// Full list
				o.put("count", store.documentCount());
				
				Cursor cursor = store.getIndex("byDate").openCursor();
				final JsonArray array = new JsonArray(cursor.count());
				cursor.find(new CursorHandler() {
					@Override
					public boolean handle(CursorEntry entry) throws JsonException {
						array.add(entry.getValue());
						return true;
					}
	    		});
				o.putArray("result", array);
			}
		} catch(Exception ex) {
			o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
		}
		context.emitJson(o);
	}

	public void processPOST(final HttpServiceContext context) {
		JsonObject o = new JsonObject();
		try {
			Store store = getResourcesStore();
			Document doc = store.newDocument();
			doc.setJson(context.getContentAsJson());
			doc.save();
			o.copyFrom(JsonObject.fromJson(doc.getJsonString()));	// TODO : plus simple ?
			// TODO : comment avoir l'ID du document ajouté au store ? (et pourquoi ne pas mettre à jour l'objet Java ?)
		} catch (Exception ex) {
			o.put("exception", HttpServiceError.exceptionAsJson(ex, false));
		}
		context.emitJson(o);
	}	
	
	private Store getResourcesStore() throws JsonException {
		Session session = DarwinoContext.get().getSession();
		Database db = session.getDatabase(AppDatabaseDef.DATABASE_NAME);
		Store store = db.getStore(AppDatabaseDef.RESOURCE_STORE_NAME);
		return store;
	}
}
