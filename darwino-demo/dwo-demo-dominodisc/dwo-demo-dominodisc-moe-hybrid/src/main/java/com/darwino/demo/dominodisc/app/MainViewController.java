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
