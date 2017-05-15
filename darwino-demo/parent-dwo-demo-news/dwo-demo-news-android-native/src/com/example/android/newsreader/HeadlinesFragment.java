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

import com.darwino.android.platform.anative.AppAndroidNativeCommandExecutor;
import com.darwino.android.platform.anative.DarwinoAndroidNativeApplication;
import com.darwino.android.platform.ui.NativeUtils;
import com.darwino.android.widget.AbstractAdapter;
import com.darwino.android.widget.json.store.JsonCursorAdapter;
import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutor;
import com.darwino.commons.tasks.TaskExecutorContext;
import com.darwino.commons.util.StringUtil;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Session;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileContext;
import com.darwino.mobile.platform.commands.AppCommand;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.os.StrictMode;
import android.support.v4.app.ListFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.TextView;

/**
 * Fragment that displays the news headlines for a particular news category.
 *
 * This Fragment displays a list with the news headlines for a particular news category.
 * When an item is selected, it notifies the configured listener that a headlines was selected.
 */
public class HeadlinesFragment extends ListFragment implements OnItemClickListener {

	private class HeadlinesCommands extends AppAndroidNativeCommandExecutor {
		HeadlinesCommands() {
		}
		@Override
		protected void _refreshUi() {
			DarwinoAndroidNativeApplication app = (DarwinoAndroidNativeApplication)DarwinoMobileApplication.get();
			if(!app.isPaused()) {
				Activity a = getActivity();
				if(a!=null) {
					a.runOnUiThread(new Runnable() {
						@Override
						public void run() {
							HeadlinesFragment.this.refreshData();
						}
					});
				}
			}
	    }
		public void markAllRead() {
			execute(new MarkAllRead(true, TaskExecutor.DIALOG_INDETERMINATE), null);
		}
		public void markAllUnread() {
			execute(new MarkAllRead(false, TaskExecutor.DIALOG_INDETERMINATE), null);
		}
	}
	
	private class MarkAllRead extends AppCommand {
		private boolean read;
		public MarkAllRead(boolean read, int options) {
			super("Mark All Documents Read, "+read, options);
			this.read = read;
		}
		@Override
		public Void execute(TaskExecutorContext context) throws TaskException {
			try {
				Session session = DarwinoMobileApplication.get().getSession();
				if(session!=null) {
		        	initCursor(session
		        			.getDatabase(NewsManifest.NEWS_DATABASE)
		        			.getStore(NewsManifest.NEWS_STORE)
		        			.getIndex("byCategory").openCursor()).markAllRead(read);
					refreshUi(context);
					if(isNotify(context)) {
						if(read) {
							notify(context,"All documents are marked as read");
						} else {
							notify(context,"All documents are marked as unread");
						}
					}
				}
	        	return null;
			} catch(JsonException ex) {
				throw new TaskException(ex);
			}
		}
	}

	// The list adapter for the list we are displaying
	JsonCursorAdapter mListAdapter;
	
	boolean initialized;
	String currentCategory;
	String currentSearch;

    // The listener we are to notify when a headline is selected
    OnHeadlineSelectedListener mHeadlineSelectedListener = null;

    /**
     * Represents a listener that will be notified of headline selections.
     */
    public interface OnHeadlineSelectedListener {
        /**
         * Called when a given headline is selected.
         * @param index the index of the selected headline.
         */
        public void onHeadlineSelected(String unid);
    }

    /**
     * Default constructor required by framework.
     */
    public HeadlinesFragment() {
        super();
    }

    
// PHIL: why onStart & onCreate???
    
    @Override
    public void onStart() {
        super.onStart();
        getListView().setOnItemClickListener(this);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
		// See: http://stackoverflow.com/questions/12742001/android-android-os-networkonmainthreadexception-when-acess-http-client
		// Should be executed in a different thread
		if( Build.VERSION.SDK_INT >= 9){
		    StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
		    StrictMode.setThreadPolicy(policy); 
		}

		setHasOptionsMenu(true);
    }

	@Override
	public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
	    inflater.inflate(R.menu.options, menu);
	    
	    // Associate searchable configuration with the SearchView
	    //SearchManager searchManager = (SearchManager) getActivity().getSystemService(Context.SEARCH_SERVICE);
	    SearchView searchView = (SearchView) menu.findItem(R.id.searchnew).getActionView();
	    //searchView.setSearchableInfo( searchManager.getSearchableInfo(getActivity().getComponentName()));	
        //searchView.setIconifiedByDefault(false);
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
			@Override
			public boolean onQueryTextSubmit(String query) {
				loadData(currentCategory, query, false);
				return false;
			}
			@Override
			public boolean onQueryTextChange(String newText) {
				return false;
			}
        });
	}

	@Override
	public void onPrepareOptionsMenu(Menu menu) {
	    int mode = DarwinoMobileApplication.get().getConnectionMode();
	    switch(mode) {
	    	case DarwinoMobileApplication.MODE_REMOTE: {
	    	    menu.findItem(R.id.switchremote).setChecked(true);
	    	} break;
	    	case DarwinoMobileApplication.MODE_LOCAL: {
	    	    menu.findItem(R.id.switchlocal).setChecked(true);
	    	} break;
	    }
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
	    switch (item.getItemId()) {
	        case R.id.refresh: {
	        	getHeadlinesCommands().refreshData();
	            return true;
	        }
	        case R.id.switchlocal: {
	        	getHeadlinesCommands().switchToLocal();
	        	item.setChecked(true);
	            return true;
	        }
	        case R.id.switchremote: {
	        	getHeadlinesCommands().switchToRemote();
	        	item.setChecked(true);
	            return true;
	        }
	        case R.id.synchronize: {
	        	getHeadlinesCommands().synchronizeData();
	            return true;
	        }
	        case R.id.erase: {
	        	getHeadlinesCommands().eraseLocalData();
	            return true;
	        }
	        case R.id.allread: {
	        	getHeadlinesCommands().markAllRead();
	            return true;
	        }
	        case R.id.allunread: {
	        	getHeadlinesCommands().markAllUnread();
	            return true;
	        }
	        case R.id.settings: {
	        	getHeadlinesCommands().openSettings();
	            return true;
	        }
	    }
        return super.onOptionsItemSelected(item);
	}	
	private HeadlinesCommands getHeadlinesCommands() {
		return new HeadlinesCommands();
	}

    /**
     * Sets the listener that should be notified of headline selection events.
     * @param listener the listener to notify.
     */
    public void setOnHeadlineSelectedListener(OnHeadlineSelectedListener listener) {
        mHeadlineSelectedListener = listener;
    }

    public void refreshData() {
    	resetAdapter();
    }

    public boolean loadData(String categoryIndex, String ftSearch, boolean force) {
    	if(initialized && !force) {
    		if(StringUtil.equals(categoryIndex, this.currentCategory) && StringUtil.equals(ftSearch, this.currentSearch)) {
    			return false;
    		}
    	}
    	this.initialized = true;
    	this.currentSearch = ftSearch;
    	this.currentCategory = categoryIndex;
    	resetAdapter();
    	return true;
    }

    private void resetAdapter() {
		DarwinoMobileApplication.get().setDirty(false);

		AbstractAdapter.ViewFactory vf = new AbstractAdapter.ViewFactory() {
			@Override
			public View getView(Adapter adapter, int position, View convertView, ViewGroup parent) {
				if(convertView==null) {
					LayoutInflater inflater = getInflater();
					convertView = inflater.inflate(R.layout.headline_item, parent, false);
				}
			    TextView txTitle = (TextView) convertView.findViewById(R.id.ItemTitle);
			    TextView txDescription = (TextView) convertView.findViewById(R.id.secondLine);
			    ImageView imageView = (ImageView) convertView.findViewById(R.id.ItemImage);
			    try {
		            CursorEntry item = (CursorEntry)adapter.getItem(position);
		            if(item!=null) {
		            	boolean read = mListAdapter.isRead(item);
		            	if(read) {
		            		convertView.setAlpha(0.4F);
		            	}
		                //txTitle.setText(item.getString("source"));
		                txTitle.setText(item.getString("title"));
		                txDescription.setText(item.getString("content").replaceAll("\\<.*?\\>", ""));
		                NativeUtils.get().loadAttachmentImage(imageView, item, NewsManifest.ATTACHMENT_NAME);			            
		            } else {
		                txTitle.setText("<empty text>");
		            }
				} catch(JsonException ex) {
					txTitle.setText(ex.toString());
					Platform.log(ex);
				}
			    return convertView;
			}
		};

		// Add a category filter here!
    	if(StringUtil.isEmpty(currentCategory)) {
    		currentCategory = NewsManifest.getCategoryFilter(0);
    	}
	    try {
	    	Session session = DarwinoMobileContext.get().getSession();
	        mListAdapter = new JsonCursorAdapter(getActivity(),session,vf) {
	            @Override
	            protected void initCursor(Cursor cursor) throws JsonException {
	            	HeadlinesFragment.this.initCursor(cursor);
	            	cursor.options(Cursor.DATA_READMARK);
	            	//cursor.extract("{source:'source',title:'title',content:'content',read:'_read'}");
	            	cursor.extract("{source:'source',title:'title',content:'content'}");
	            }
	        };
	        mListAdapter.init("news","news","byCategory").setDefaultBlockSize(10);
	    	mListAdapter.addAllRows();
			setListAdapter(mListAdapter);

			// Make sure that no article is left selected
			if (null != mHeadlineSelectedListener) {
	        	mHeadlineSelectedListener.onHeadlineSelected(null);
			}
		} catch(JsonException ex) {
			Platform.log(ex);
			setListAdapter(null);
		}
	    
    }
    protected Cursor initCursor(Cursor cursor) throws JsonException {
		// Should cumulate with the other!
    	if(StringUtil.isNotEmpty(currentCategory)) {
    		cursor.partialKey(currentCategory);
    	}
    	if(StringUtil.isNotEmpty(currentSearch)) {
    		cursor.ftSearch(currentSearch);
    		cursor.orderByFtRank();
    	}
    	return cursor;
    }

    /**
     * Handles a click on a headline.
     *
     * This causes the configured listener to be notified that a headline was selected.
     */
    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        if (null != mHeadlineSelectedListener) {
        	try {
        		CursorEntry e = (CursorEntry)parent.getItemAtPosition(position);
        		if(e!=null) {
	        		// How to update one single entry?
	        		// This should be added to the base adapter
	        		if(mListAdapter.markRead(e)) {
	        			ListView lv = getListView();
	        			mListAdapter.notifyItemChanged(lv, position);
	        		}
	        		String unid = e.getUnid();
	        		mHeadlineSelectedListener.onHeadlineSelected(unid);
        		}
        	} catch(JsonException ex) {
        		Log.e(null, "Error while accessing cursor entry UNID", ex);
        	}
        }
    }

    /** Sets choice mode for the list
     *
     * @param selectable whether list is to be selectable.
     */
    public void setSelectable(boolean selectable) {
        if (selectable) {
            getListView().setChoiceMode(ListView.CHOICE_MODE_SINGLE);
        }
        else {
            getListView().setChoiceMode(ListView.CHOICE_MODE_NONE);
        }
    }
}
