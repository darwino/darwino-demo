package com.darwino.commons.robovm.ui;

import java.util.concurrent.Callable;

import org.robovm.apple.uikit.UIAlertView;
import org.robovm.apple.uikit.UIAlertViewDelegate;
import org.robovm.apple.uikit.UIAlertViewDelegateAdapter;

import com.darwino.commons.util.StringUtil;

/**
 * Similar to {@link com.darwino.commons.android.io.Dialogs}
 * @author Jesse Gallagher
 *
 */
public class Dialogs {
	public static int DLG_YES = 0;
	public static int DLG_NO = 1;
	
	public static interface DialogCallback {
		void handleResponse(int responseValue);
	}
	
	public static void yesNo(final DialogCallback callback, String title, String msg, Object... params) {
		String message = StringUtil.format(msg, params);
		
		UIAlertViewDelegate delegate = new  UIAlertViewDelegateAdapter() {
			@Override
			public void cancel(UIAlertView alertView) {
				callback.handleResponse(DLG_NO);
			}
			@Override
			public void clicked(UIAlertView alertView, long buttonIndex) {
				switch((int)buttonIndex) {
				case 0:
					callback.handleResponse(DLG_NO);
					break;
				case 1:
					callback.handleResponse(DLG_YES);
					break;
				default:
					// How could we get here?
					throw new IllegalStateException("Encountered unexpected buttonIndex: " + buttonIndex);
				}
			}
		};
		UIAlertView alert = new UIAlertView(title, message, delegate, "No", "Yes");
		
		alert.show();
		
	}
}
