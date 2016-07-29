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

package com.darwino.demo.dominodisc.app;
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

import org.robovm.apple.foundation.NSAutoreleasePool;
import org.robovm.apple.uikit.UIApplication;
import org.robovm.apple.uikit.UIApplicationDelegateAdapter;
import org.robovm.apple.uikit.UIApplicationLaunchOptions;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UINavigationController;
import org.robovm.apple.uikit.UIScreen;
import org.robovm.apple.uikit.UIWindow;

import com.darwino.commons.Platform;
import com.darwino.commons.platform.PluginIOS;
import com.darwino.sqlite.IOSInstall;

public class IOSMainClass extends UIApplicationDelegateAdapter {

    private UIWindow window = null;

    @Override
    public boolean didFinishLaunching (UIApplication application, UIApplicationLaunchOptions launchOptions) {
        try {
        	IOSInstall.init();
        } catch(Throwable t) {
        	t.printStackTrace();
        }
    	
		try {
	        AppHybridApplication.create();
		} catch(Throwable t) {
			Platform.log(t);
			return false;
		}

        window = new UIWindow(UIScreen.getMainScreen().getBounds());
        window.setBackgroundColor(UIColor.lightGray());
        UINavigationController navigationController = new UINavigationController(
                application.addStrongRef(new MainViewController()));
        window.setRootViewController(navigationController);
        window.makeKeyAndVisible();

        return true;
    }

    @SuppressWarnings("unused")
	public static void main(String[] args) {
		// Make sure that these plugin are registered
    	Class<?> c1 = PluginIOS.class;
    	Class<?> c2 = AppMobilePlugin.class;
    	Class<?> c3 = AppPlugin.class;
		
        NSAutoreleasePool pool = new NSAutoreleasePool();
        UIApplication.main(args, null, IOSMainClass.class);
        pool.close();
    }
}