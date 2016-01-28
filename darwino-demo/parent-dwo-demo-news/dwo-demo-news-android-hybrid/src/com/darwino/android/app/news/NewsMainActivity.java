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

package com.darwino.android.app.news;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.darwino.android.platform.hybrid.DarwinoCordovaHybridActivity;
import com.darwino.commons.Platform;
import com.darwino.mobile.hybrid.platform.DarwinoMobileHybridApplication;
import com.darwino.mobile.platform.DarwinoMobileApplication;

public class NewsMainActivity extends DarwinoCordovaHybridActivity {
	
	public NewsMainActivity() {
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        
		try {
			NewsAndroidHybridApplication.create(getApplication());
		} catch(Exception t) {
			Platform.log(t);
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
