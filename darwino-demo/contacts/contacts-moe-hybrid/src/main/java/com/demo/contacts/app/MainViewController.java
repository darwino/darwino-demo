/*!COPYRIGHT HEADER! 
 *
 */

package com.demo.contacts.app;

import org.moe.natj.general.NatJ;
import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.Owned;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ObjCRuntime;
import org.moe.natj.objc.ann.ObjCClassName;
import org.moe.natj.objc.ann.Selector;

import com.darwino.ios.platform.hybrid.DarwinoIOSHybridViewController;

/**
 * Application main view frame.
 */
@org.moe.natj.general.ann.Runtime(ObjCRuntime.class)
@ObjCClassName("MainViewController")
@RegisterOnStartup
public class MainViewController extends DarwinoIOSHybridViewController {

	static {
        NatJ.register();
    }

    @Owned
    @Selector("alloc")
    public static native MainViewController alloc();

    @Override
	@Selector("init")
    public DarwinoIOSHybridViewController init() {
    	return super.init();
    }

    protected MainViewController(Pointer peer) {
        super(peer);
    }
	
}