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
import com.darwino.demo.news.robovm.MainViewController;
import com.darwino.demo.news.robovm.NewsRoboVMNativeApplication;
import com.darwino.sqlite.IOSInstall;
import com.darwino.sqlite.SQLiteImpl;

public class IOSNews extends UIApplicationDelegateAdapter {

    private UIWindow window;
    private MainViewController mainViewController;

    @Override
    public boolean didFinishLaunching (UIApplication application, UIApplicationLaunchOptions launchOptions) {
        try {
        	IOSInstall.init();
        	System.out.println("SQLITE: "+SQLiteImpl.get().libversion());
        } catch(Throwable t) {
        	t.printStackTrace();
        }
    	
		try {
			NewsRoboVMNativeApplication.create();
		} catch(Throwable t) {
			Platform.log(t);
			return false;
		}

        mainViewController = new MainViewController();
        UINavigationController navigationController = new UINavigationController(mainViewController);

        window = new UIWindow(UIScreen.getMainScreen().getBounds());
        window.setBackgroundColor(UIColor.lightGray());
        window.setRootViewController(navigationController);
        window.makeKeyAndVisible();
        

        return true;
    }

    public static void main(String[] args) {
    	Class<?> c = PluginIOS.class; // Make sure this is loaded
	    	
        NSAutoreleasePool pool = new NSAutoreleasePool();
        UIApplication.main(args, null, IOSNews.class);
        pool.close();
    }


}