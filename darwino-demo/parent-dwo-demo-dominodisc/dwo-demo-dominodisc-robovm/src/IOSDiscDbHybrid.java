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
import com.darwino.demo.projexec.robovm.MainViewController;
import com.darwino.demo.projexec.robovm.DiscDbRoboVMHybridApplication;
import com.darwino.sqlite.IOSInstall;
import com.darwino.sqlite.SQLiteImpl;

public class IOSDiscDbHybrid extends UIApplicationDelegateAdapter {

    private UIWindow window = null;

    @Override
    public boolean didFinishLaunching (UIApplication application, UIApplicationLaunchOptions launchOptions) {
        try {
        	IOSInstall.init();
        	System.out.println("SQLITE: "+SQLiteImpl.get().libversion());
        } catch(Throwable t) {
        	t.printStackTrace();
        }
    	
		try {
	        DiscDbRoboVMHybridApplication.create();
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

        // Ties UIWindow instance together with UIApplication object on the
        // Objective C side of things
        // Basically meaning that it wont be GC:ed on the java side until it is
        // on the Objective C side
        application.addStrongRef(window);

        return true;
    }

    public static void main(String[] args) {
    	Class c = PluginIOS.class;
    	
        NSAutoreleasePool pool = new NSAutoreleasePool();
        UIApplication.main(args, null, IOSDiscDbHybrid.class);
        pool.close();
    }


}