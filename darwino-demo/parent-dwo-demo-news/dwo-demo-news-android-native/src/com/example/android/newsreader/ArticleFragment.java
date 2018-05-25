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

/*
 * Copyright (C) 2011 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.android.newsreader;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.TextView;

import com.darwino.android.platform.ui.NativeUtils;
import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Document;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;

/**
 * Fragment that displays a news article.
 */
public class ArticleFragment extends Fragment {
    // The webview where we display the article (our only view)
    View rootView;
	TextView txTitle;
	WebView mWebView;

    // The article we are to display
    Document mNewsArticle = null;

    // Parameterless constructor is needed by framework
    public ArticleFragment() {
        super();
    }

    /**
     * Sets up the UI. It consists if a single WebView.
     */
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.article_item, container, false);

		txTitle = (TextView) rootView.findViewById(R.id.itemTitle);
		mWebView = (WebView)rootView.findViewById(R.id.itemContent);

        // Initialize the web view credentials
		NativeUtils.get().initWebView(mWebView);
		
    	try {
            loadWebView();
    	} catch(JsonException ex) {
    		Log.e(null, "Error while accessing document content", ex);
    	}
        return rootView;
    }

    /**
     * Displays a particular article.
     *
     * @param article the article to display
     */
    public void displayArticle(String unid) {
        mNewsArticle = null;
    	try {
    		if(StringUtil.isNotEmpty(unid)) {
    			Store store = NewsManifest.getNewsStore();
    			mNewsArticle = store.loadDocument(unid);
    		}
	        loadWebView();
    	} catch(JsonException ex) {
    		Log.e(null, "Error while accessing document content", ex);
    	}
    }

    /**
     * Loads article data into the webview.
     *
     * This method is called internally to update the webview's contents to the appropriate
     * article's text.
     */
    void loadWebView() throws JsonException {
    	if(mNewsArticle!=null) {
    		String source = mNewsArticle.getString("source");
    		String category = mNewsArticle.getString("category");
    		String title = mNewsArticle.getString("title");
    		// See NativeUtils
    		// There is an issue with KitKat when the browser accesses protected resources.
    		// we then use the same URL for both HTTP and local connections.
    		//String img = mNewsArticle.getAttachmentUrl(NewsConfiguration.ATTACHMENT_NAME);
    		String img = NativeUtils.get().getUrlBuilder().getAttachmentUrl(mNewsArticle.getDatabase().getId(), mNewsArticle.getStore().getId(), mNewsArticle.getUnid(), NewsManifest.ATTACHMENT_NAME);
    		
    		String content = mNewsArticle.getString("content");
    		if(txTitle!=null) {
    			if(StringUtil.isNotEmpty(source) || StringUtil.isNotEmpty(category)) {
    				txTitle.setText("From: "+source+", "+category);
    			}
    		}
    		if(mWebView!=null) {
	        	StringBuilder b = new StringBuilder(256);
	        	if(StringUtil.isNotEmpty(title)) {
	        		b.append("<h1>").append(title).append("</h1>");
	        	}
	        	if(StringUtil.isNotEmpty(img)) {
	        		b.append("<img src='").append(img).append("' height='100' width='100' align='left'/>");
	        	}
	        	if(StringUtil.isNotEmpty(content)) {
	        		b.append(content);
	        	}
	        	try {
		        	Cursor c = mNewsArticle.getDatabase().getStore(Database.STORE_COMMENTS).openCursor();
		        	c.parent(mNewsArticle);
		        	final StringBuilder cb = new StringBuilder(256);
		        	int count = c.find(new CursorHandler() {
						@Override
						public boolean handle(CursorEntry entry) throws JsonException {
							String author = entry.getString("author");
							String title = entry.getString("title");
							String content = entry.getString("content");
							cb.append("<br/><span style='font-size=1em;font-weight:bold'>").append(title).append("</span>");
							cb.append(", <i>").append(author).append("</i><br/>");
							cb.append("<div style='font-size=0.8em'>").append(content).append("</div>");
							return true;
						}
					});
		        	b.append("<hr/>");
		        	b.append("<h3>Comments (").append(count).append(")</h3>");
		        	b.append(cb);
	        	} catch(JsonException ex) {
	        		Platform.log(ex);
	        	}
	        	String html = b.toString();
	        	mWebView.loadData(html, "text/html", "utf-8");
    		}
    	} else {
       		txTitle.setText("");
        	mWebView.loadData("Select an article in the list", "text/html", "utf-8");
    	}
    }
}
