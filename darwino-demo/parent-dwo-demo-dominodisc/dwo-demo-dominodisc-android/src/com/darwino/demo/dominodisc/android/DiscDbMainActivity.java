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

package com.darwino.demo.dominodisc.android;

import android.app.Activity;
import android.os.Bundle;

import com.darwino.android.platform.hybrid.DarwinoAndroidHybridActions;
import com.darwino.android.platform.hybrid.DarwinoCordovaHybridActivity;
import com.darwino.android.platform.hybrid.HybridJavaScriptInterface;
import com.darwino.mobile.platform.hybrid.MobileHybridRestFactory;

public class DiscDbMainActivity extends DarwinoCordovaHybridActivity {
	
	private class DiscDbTasks extends DarwinoAndroidHybridActions {
		DiscDbTasks(Activity activity) {
			super(activity);
		}
		@Override
		public void refreshUi() {
			loadMainPage();
	    }
	}

	public DiscDbMainActivity() {
		// TEMP here...
		MobileHybridRestFactory.hybridTasks = getCommonTasks(); 
	}
	
	@Override
	public Object getDawinoJSInterface() {
		return new HybridJavaScriptInterface(getCommonTasks());
	}
	private DiscDbTasks getCommonTasks() {
		return new DiscDbTasks(getActivity());
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		try {
			DiscDbAndroidHybridApplication.create(getApplication());
		} catch(Throwable t) {
			closeActivity(t);
		}
        
        loadMainPage();
	}

/*	
	@TargetApi(Build.VERSION_CODES.KITKAT)
	@Override
    public void init(CordovaWebView webView, CordovaWebViewClient webViewClient, CordovaChromeClient webChromeClient) {
		super.init(webView, webViewClient, webChromeClient);
		
		//WebSettings settings =  webView.getSettings();
		//settings.setAllowUniversalAccessFromFileURLs(true);
		
//		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
//		    if(true || (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE )!=0 ) {
//		        //webView.setWebContentsDebuggingEnabled(true);
//		    	try {
//			    	Method m = CordovaWebViewClient.class.getMethod("setWebContentsDebuggingEnabled", Boolean.TYPE);
//			    	m.invoke(webView, true);
//		    	} catch(Exception ex) {
//		    		ex.printStackTrace();
//		    	}
//		    }
//		}
		
		// Enable debugging for KitKat
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
		    if(true || (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE )!=0 ) {
		        WebView.setWebContentsDebuggingEnabled(true);
		    }
		}    
	}
*/
}
