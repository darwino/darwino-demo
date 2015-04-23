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

package com.darwino.android.app.news;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.darwino.android.platform.hybrid.DarwinoCordovaHybridActivity;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileHybridApplication;

public class NewsMainActivity extends DarwinoCordovaHybridActivity {
	
	public NewsMainActivity() {
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        
		try {
			NewsAndroidHybridApplication.create(getApplication());
		} catch(Throwable t) {
			closeActivity(t);
		}
		
        loadMainPage();
	}
//	
//	protected void loadMainPage() {
//		String baseUrl = DarwinoMobileHybridContext.get().getApplication().getResourcesUrl();
//		String url = PathUtil.concat(baseUrl, "news/index.html", '/');
//		loadUrl(url);
//	}
	
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.rad_next, menu);
		return true;
	}

	@Override
	public boolean onPrepareOptionsMenu(Menu menu) {
	    int mode = DarwinoMobileApplication.get().getSettings().getConnectionMode();
	    switch(mode) {
	    	case DarwinoMobileApplication.MODE_REMOTE: {
	    	    menu.findItem(R.id.switchremote).setChecked(true);
	    	} break;
	    	case DarwinoMobileApplication.MODE_LOCAL: {
	    	    menu.findItem(R.id.switchlocal).setChecked(true);
	    	} break;
	    	case DarwinoMobileHybridApplication.MODE_WEB: {
	    	    menu.findItem(R.id.switchweb).setChecked(true);
	    	} break;
	    }
	    return true;
	}
	
	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
	    switch (item.getItemId()) {
	        case R.id.refresh: {
	        	createDarwinoTasks().refreshData();
	            return true;
	        }
	        case R.id.switchlocal: {
	        	createDarwinoTasks().switchToLocal();
	            return true;
	        }
	        case R.id.switchremote: {
	        	createDarwinoTasks().switchToRemote();
	            return true;
	        }
	        case R.id.switchweb: {
	        	createDarwinoTasks().switchToWeb();
	            return true;
	        }
	        case R.id.synchronize: {
	        	createDarwinoTasks().synchronizeData();
	            return true;
	        }
	        case R.id.erase: {
	        	createDarwinoTasks().eraseLocalData();
	            return true;
	        }
	    }
        return super.onOptionsItemSelected(item);
	}	
}
