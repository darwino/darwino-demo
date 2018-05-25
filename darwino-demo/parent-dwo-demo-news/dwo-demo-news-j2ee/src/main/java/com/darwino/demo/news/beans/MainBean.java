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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;

import org.primefaces.model.LazyDataModel;
import org.primefaces.model.SortOrder;

import com.darwino.application.jsonstore.NewsDatabaseDef;
import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.json.JsonObject;
import com.darwino.commons.util.PathUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.UrlBuilder;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;
import com.darwino.jsonstore.impl.UrlBuilderImpl;
import com.darwino.runtime.util.HttpUtil;


/**
 * Bean associated to the main page.
 * 
 * @author Philippe Riand
 */
//@SuppressWarnings("serial")
//@ManagedBean(name="mainBean")
//@ViewScoped
public class MainBean implements Serializable {
	private static final long serialVersionUID = 1L;
	
	public static final int INDEX_BYDATE				= 0;
	public static final int INDEX_BYDATEWITHCOMMENTS	= 1;
	public static final int INDEX_BYCATEGORY			= 2;
	public static final int INDEX_BYSOURCE				= 3;

	private int currentIndex;
	private LazyDataModel<Object> model;
	
	// This is serializable and cross requests in JSF...
	public static class RowEntry implements Serializable {
		private static final long serialVersionUID = 1L;
		
		boolean			category;
		Object			value;
		List<RowEntry>	comments;
		public boolean isCategory() {
			return category;
		}
		public void setCategory(boolean category) {
			this.category = category;
		}
		public Object getValue() {
			return value;
		}
		public void setValue(Object value) {
			this.value = value;
		}
		public List<RowEntry> getComments() {
			return comments;
		}
		public void setComments(List<RowEntry> comments) {
			this.comments = comments;
		}
	}
	
	public MainBean() {
		model = new LazyDataModel<Object>() {
			private static final long serialVersionUID = 1L;

			@SuppressWarnings("rawtypes")
			@Override
			public List<Object> load(int first, int pageSize, String sortField, SortOrder sortOrder, Map filters) {
		    	final ArrayList<Object> l = new ArrayList<Object>();
		    	try {
		    		HttpServletRequest req = (HttpServletRequest)FacesContext.getCurrentInstance().getExternalContext().getRequest();
		    		String reqUrl = HttpUtil.getContextUrl(req);
					//final UrlBuilder ub = DatabaseSession.get().getUrlBuilder();
					final UrlBuilder ub = new UrlBuilderImpl(PathUtil.concat(reqUrl,"$darwino-jstore",'/'));
			    	Cursor cursor = DatabaseSession.get().getDatabase(NewsDatabaseDef.DATABASE_NEWS)
			    			.getStore(NewsDatabaseDef.STORE_NEWS)
			    			.getIndex(getIndexName())
			    			.openCursor()
			    			.descending()
			    			.range(first, pageSize);
			    	if(currentIndex==INDEX_BYDATEWITHCOMMENTS) {
			    		cursor.hierarchical(5);
			    		Cursor commentCursor = DatabaseSession.get().getDatabase(NewsDatabaseDef.DATABASE_NEWS)
			    									.getStore(Database.STORE_COMMENTS)
			    									.openCursor()
			    									.ascending();
			    		cursor.subQueries(new Cursor.SubQuery("comments",commentCursor,Cursor.LINK_PARENT));
			    	}
			    	if(currentIndex!=INDEX_BYDATE && currentIndex!=INDEX_BYDATEWITHCOMMENTS) {
			    		cursor.categories(1);
			    	}
		    		cursor.find(new CursorHandler() {
						@Override
						public boolean handle(CursorEntry entry) throws JsonException {
							RowEntry re = new RowEntry();
							re.category = entry.isCategory();
							re.value = entry.getJson();
							// Read the entry
							if(entry.isCategory()) {
								//
								re.value = entry.getKey();
							} else {
								if(entry.getStoreId().equals("news")) {
									if(ub!=null) {
										((JsonObject)entry.getJson()).put("thumbnailUrl", ub.getAttachmentUrl(NewsDatabaseDef.DATABASE_NEWS, NewsDatabaseDef.STORE_NEWS, entry.getUnid(), NewsManifest.ATTACHMENT_NAME));
									}
								}
								// Read the comments
								final List<RowEntry> comments = re.comments = new ArrayList<RowEntry>();
								try {
									entry.findSubQueryEntries("comments", new CursorHandler() {
										@Override
										public boolean handle(CursorEntry entry) throws JsonException {
											RowEntry ce = new RowEntry();
											ce.category = entry.isCategory();
											ce.value = entry.getJson();
											comments.add(ce);
											return true;
										}
									});
								} catch(JsonException ex) {
									Platform.log(ex);
								}
							}
							l.add(re);
							return true;
						}
		    		});
		    		
		    		// Calculate the # of entries
			    	setRowCount(cursor.count());
		    	} catch(JsonException ex) {
		    		Platform.log(ex);
		    	}
		    	return l;
			}
		};
	}
	
	public String getIndexName() {
		switch(currentIndex) {
			case INDEX_BYDATE:		return "byDate";
			case INDEX_BYCATEGORY:	return "byCategory";
			case INDEX_BYSOURCE:	return "bySource";
		}
		return "byDate"; 
	}

    public void byDate() {
    	this.currentIndex = INDEX_BYDATE;
	}

    public void byDateWithComments() {
    	this.currentIndex = INDEX_BYDATEWITHCOMMENTS;
	}
    
    public void byCategory() {
    	this.currentIndex = INDEX_BYCATEGORY;
	}
    
    public void bySource() {
    	this.currentIndex = INDEX_BYSOURCE;
	}
    
    public LazyDataModel<Object> getModel() {
    	return model;
    }
}
