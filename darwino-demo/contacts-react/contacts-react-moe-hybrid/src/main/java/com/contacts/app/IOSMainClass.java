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

package com.contacts.app;

import apple.NSObject;
import apple.foundation.NSDictionary;
import apple.uikit.UIApplication;
import apple.uikit.UIColor;
import apple.uikit.UINavigationController;
import apple.uikit.UIScreen;
import apple.uikit.UIWindow;
import apple.uikit.c.UIKit;
import apple.uikit.protocol.UIApplicationDelegate;

import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ann.Selector;

import com.darwino.commons.Platform;
import com.darwino.sqlite.IOSInstall;

@RegisterOnStartup
public class IOSMainClass extends NSObject implements UIApplicationDelegate {

	public static void main(String[] args) {
    	UIKit.UIApplicationMain(0, null, null, IOSMainClass.class.getName());
    }
    
	@Selector("alloc")
    public static native IOSMainClass alloc();

    protected IOSMainClass(Pointer peer) {
        super(peer);
    }
	
    private UIWindow window = null;
    
    @Override
    public boolean applicationDidFinishLaunchingWithOptions(UIApplication application, NSDictionary<?, ?> launchOptions) {
    	Platform.setDevelopment(true);
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

        window = UIWindow.alloc().initWithFrame(UIScreen.mainScreen().bounds());
        window.setBackgroundColor(UIColor.lightGrayColor());
        
        UINavigationController navigationController = UINavigationController.alloc().initWithRootViewController(MainViewController.alloc().init());
        window.setRootViewController(navigationController);
        window.makeKeyAndVisible();

        return true;
    }
}