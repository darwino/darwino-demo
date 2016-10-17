/**
 * Copyright 2016 MattaKis Consulting Kft.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.darwino.demo.news.moe;

import com.darwino.commons.Platform;
import com.darwino.sqlite.IOSInstall;
import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ann.Selector;

import apple.NSObject;
import apple.foundation.NSDictionary;
import apple.uikit.UIApplication;
import apple.uikit.UIColor;
import apple.uikit.UINavigationController;
import apple.uikit.UIScreen;
import apple.uikit.UIWindow;
import apple.uikit.c.UIKit;
import apple.uikit.protocol.UIApplicationDelegate;

@RegisterOnStartup
public class Main extends NSObject implements UIApplicationDelegate {

    public static void main(String[] args) {
        UIKit.UIApplicationMain(0, null, null, Main.class.getName());
    }

    @Selector("alloc")
    public static native Main alloc();

    protected Main(Pointer peer) {
        super(peer);
    }

    private UIWindow window;
    private MainViewController mainViewController;

    @Override
    public boolean applicationDidFinishLaunchingWithOptions(UIApplication application, NSDictionary launchOptions) {
        Platform.setDevelopment(true);
        try {
            IOSInstall.init();
        } catch(Exception t) {
            Platform.log(t);
        }
        try {
            NewsMOENativeApplication.create();
        } catch(Exception t) {
            Platform.log(t);
            return false;
        }

        mainViewController = MainViewController.alloc().init();
        UINavigationController navigationController = UINavigationController.alloc()
                .initWithRootViewController(mainViewController);
        window = UIWindow.alloc().initWithFrame(UIScreen.mainScreen().bounds());
        window.setBackgroundColor(UIColor.lightGrayColor());
        window.setRootViewController(navigationController);
        window.makeKeyAndVisible();

        return true;
    }

}
