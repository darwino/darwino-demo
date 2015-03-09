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

package com.darwino.demo.news.robovm;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.NSURL;
import org.robovm.apple.foundation.NSURLCache;
import org.robovm.apple.foundation.NSURLRequest;
import org.robovm.apple.uikit.UIApplication;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UIViewAutoresizing;
import org.robovm.apple.uikit.UIViewController;
import org.robovm.apple.uikit.UIWebView;
import org.robovm.apple.uikit.UIWebViewDelegateAdapter;
import org.robovm.objc.annotation.Method;

import com.darwino.commons.util.PathUtil;
import com.darwino.ios.platform.hybrid.DarwinoIOSHybridActions;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileHybridContext;
import com.darwino.mobile.platform.hybrid.MobileHybridRestFactory;

/**
 * Application main view frame.
 */
public class MainViewController extends UIViewController {
	
    public static final float LEFT_MARGIN = 20.0f;
    public static final float TOP_MARGIN = 20.0f;
    public static final float RIGHT_MARGIN = 20.0f;

    private UIWebView myWebView;

    @Override
	@Method
    public void viewDidLoad() {
        super.viewDidLoad();
        this.setTitle("");

        // create the UIWebView
        CGRect webFrame = this.getView().getFrame();
        CGRect webViewBounds = new CGRect(0.0, 0.0,webFrame.getWidth(), webFrame.getHeight()-40);

        myWebView = new UIWebView(webViewBounds);
        myWebView.setBackgroundColor(UIColor.white());
        myWebView.setScalesPageToFit(true);
        myWebView.setAutoresizingMask(UIViewAutoresizing.FlexibleWidth);
        myWebView.setDelegate(new WebViewDelegate());
        NSURLCache.getSharedURLCache().removeAllCachedResponses();
        getView().addSubview(myWebView);

        onCreate();
    }
    
	public void onCreate() {
		// TEMP here...
		MobileHybridRestFactory.hybridTasks = new DarwinoIOSHybridActions() {
			@Override
			public void refreshUi() {
				loadMainPage();
		    }
		};
		
        loadMainPage();
	}
	
	protected void loadMainPage() {
		String baseUrl = DarwinoMobileHybridContext.get().getApplication().getResourcesUrl();
		String url = PathUtil.concat(baseUrl, "news/index.html", '/');
		//url = "http://127.0.0.1:7979/news/index.html";
		System.out.println("Url:"+url);
        myWebView.loadRequest(new NSURLRequest(new NSURL(url)));
		DarwinoMobileApplication.get().setDirty(false);
		
//		if(mode==DarwinoExecutionContext.MODE_WEB) {
//			loadUrl("http://127.0.0.1:7934/news/index.html");
//		} else {
//	        //super.loadUrl("http://127.0.0.1:7934/index.html");
//			//loadUrl("file:///android_asset/www/index.html");		
//			loadUrl("http://127.0.0.1:7934/news/index.html");
//		}
	}
	
	
	
    private class WebViewDelegate extends UIWebViewDelegateAdapter {
        @Override
        public void didStartLoad(UIWebView webView) {
            UIApplication.getSharedApplication().setNetworkActivityIndicatorVisible(true);
        }

        @Override
        public void didFinishLoad(UIWebView webView) {
            UIApplication.getSharedApplication().setNetworkActivityIndicatorVisible(false);
        }
    }

    @Override
	public void viewWillAppear(boolean animated) {
        super.viewWillAppear(animated);

        myWebView.setDelegate(new WebViewDelegate()); // setup the delegate as the web view is shown
    }

    @Override
	public void viewWillDisappear(boolean animated) {
        super.viewWillDisappear(animated);

        myWebView.stopLoading(); // in case the web view is still loading its content
        myWebView.setDelegate(null); // disconnect the delegate as the webview is hidden
        UIApplication.getSharedApplication().setNetworkActivityIndicatorVisible(false);
    }
}
