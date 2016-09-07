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

package com.darwino.demo.news.moe;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.jsonstore.replication.ConsoleReplicationProgress;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import org.moe.natj.general.NatJ;
import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.Owned;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ObjCRuntime;
import org.moe.natj.objc.SEL;
import org.moe.natj.objc.ann.ObjCClassName;
import org.moe.natj.objc.ann.Selector;

import java.util.LinkedList;

import ios.coregraphics.c.CoreGraphics;
import ios.coregraphics.struct.CGRect;
import ios.foundation.NSArray;
import ios.foundation.NSIndexPath;
import ios.uikit.UIBarButtonItem;
import ios.uikit.UIColor;
import ios.uikit.UITableView;
import ios.uikit.UITableViewCell;
import ios.uikit.UITableViewController;
import ios.uikit.enums.UIBarButtonItemStyle;
import ios.uikit.enums.UITableViewCellAccessoryType;
import ios.uikit.enums.UIViewContentMode;

/**
 * The application's main view controller (front page)
 */
@org.moe.natj.general.ann.Runtime(ObjCRuntime.class)
@ObjCClassName("MainViewController")
@RegisterOnStartup
public class MainViewController extends UITableViewController {

    static {
        NatJ.register();
    }

    @Owned
    @Selector("alloc")
    public static native MainViewController alloc();

    @Selector("init")
    public native MainViewController init();

    protected MainViewController(Pointer peer) {
        super(peer);
    }

    private LinkedList<MenuListItem> menuList = new LinkedList<MenuListItem>();

    private final static String MY_CELL_IDENTIFIER = "MyTableViewCell"; //$NON-NLS-1$

    private class MenuListItem {
        private String category;

        public MenuListItem(String category) {
            super();
            this.category = category;
        }

        public String getCategory() {
            return this.category;
        }
    }

    private NewsViewController newsViewController;

    /**
     * construct the array of page descriptions we will use (each description is
     * a dictionary)
     */
    @Override
    public void viewDidLoad() {
        super.viewDidLoad();

        // <rect key="frame" x="0.0" y="64" width="320" height="416"/>
        CGRect tableViewBounds = CoreGraphics.CGRectMake(0.0, 64.0, 320, 416);
        UITableView tableView = UITableView.alloc().initWithFrame(tableViewBounds);
        tableView.setContentMode(UIViewContentMode.ScaleToFill);
        setTableView(tableView);

        // Add items to list where they will be retrieved when to display
        this.newsViewController = NewsViewController.alloc().init();
        String[] cat = NewsManifest.getCategoryLabels();
        for (String element : cat) {
            menuList.add(new MenuListItem(element));
        }

        createTopbar();
        createToolbar();

        tableView().registerClassForCellReuseIdentifier(
                new org.moe.natj.objc.Class("UITableViewCell"),
                MY_CELL_IDENTIFIER);
    }

    private void createTopbar() {
        UIBarButtonItem backButton = UIBarButtonItem.alloc().init();
        backButton.setTitle("Back");
        this.navigationItem().setBackBarButtonItem(backButton);
    }

    @Selector("buttonAction:")
    public void buttonAction(Object sender) {
        if (sender instanceof  UIBarButtonItem) {
            UIBarButtonItem barButtonItem = (UIBarButtonItem) sender;
            switch ((int) barButtonItem.tag()) {
                case 0: {
                    try {
                        DarwinoMobileApplication app = DarwinoMobileApplication.get();
                        if(app.getConnectionMode()==DarwinoMobileApplication.MODE_LOCAL) {
                            System.out.println("GO ONLINE");
                            app.switchToRemote();
                            barButtonItem.setTitle("Go Offline");
                        } else {
                            System.out.println("GO OFFLINE");
                            app.switchToLocal();
                            barButtonItem.setTitle("Go Online");
                        }
                    } catch(Exception t) {
                        Platform.log(t);
                    }
                    break;
                }
                case 1: {
                    Platform.log("SYNC DATA");
                    try {
                        DarwinoMobileApplication app = DarwinoMobileApplication.get();
                        app.synchronize(new ConsoleReplicationProgress());
                    } catch(Exception t) {
                        Platform.log(t);
                    }
                    break;
                }
                case 2: {
                    Platform.log("INIT");
                    try {
                        DarwinoMobileApplication app = DarwinoMobileApplication.get();
                        app.deleteLocalSqlLiteFile(true);
                    } catch(Exception t) {
                        Platform.log(t);
                    }
                    break;
                }
                case 3: {
                    DarwinoMobileApplication app = DarwinoMobileApplication.get();
                    app.createCommandExecutor().openSettings();
                    break;
                }
            }
        }
    }

    private void createToolbar() {
        UIBarButtonItem onlineButtonItem = UIBarButtonItem.alloc()
                .initWithTitleStyleTargetAction("Go Offline",
                        UIBarButtonItemStyle.Plain, this,
                        new SEL("buttonAction:"));
        onlineButtonItem.setTag(0);
        UIBarButtonItem syncButtonItem = UIBarButtonItem.alloc()
                .initWithTitleStyleTargetAction("Sync Data",
                        UIBarButtonItemStyle.Plain, this,
                        new SEL("buttonAction:"));
        syncButtonItem.setTag(1);
        UIBarButtonItem initButtonItem = UIBarButtonItem.alloc()
                .initWithTitleStyleTargetAction("Init",
                        UIBarButtonItemStyle.Plain, this,
                        new SEL("buttonAction:"));
        initButtonItem.setTag(2);
        UIBarButtonItem settingsItem = UIBarButtonItem.alloc()
                .initWithTitleStyleTargetAction("Settings",
                        UIBarButtonItemStyle.Plain, this,
                        new SEL("buttonAction:"));
        settingsItem.setTag(3);

        this.setToolbarItems((NSArray<UIBarButtonItem>) NSArray.arrayWithObjects(
                onlineButtonItem,
                syncButtonItem,
                initButtonItem,
                settingsItem,
                null));
        this.navigationController().setToolbarHidden(false);
    }

    @Override
    public void viewWillAppear(boolean animated) {
        super.viewWillAppear(animated);

        // this UIViewController is about to re-appear, make sure we remove the
        // current selection in our table view
        NSIndexPath tableSelection = this.tableView().indexPathForSelectedRow();
        this.tableView().deselectRowAtIndexPathAnimated(tableSelection, false);

        // some over view controller could have changed our nav bar tint color,
        // so reset it here
        this.navigationController().navigationBar().setTintColor(UIColor.darkGrayColor());
    }

    /**
     * the table's selection has changed, switch to that item's UIViewController
     */
    @Override
    public void tableViewDidSelectRowAtIndexPath(final UITableView tableView,
                                                 final NSIndexPath indexPath) {
        final int index = (int) indexPath.row();
        MenuListItem item = menuList.get(index);
        newsViewController.loadCategory(item.getCategory());
        this.navigationController().pushViewControllerAnimated(newsViewController, true);
    }

    @Override
    public long tableViewNumberOfRowsInSection(UITableView tableView, long section) {
        return menuList.size();
    }

    @Override
    public UITableViewCell tableViewCellForRowAtIndexPath(UITableView tableView,
                                                          NSIndexPath indexPath) {
        UITableViewCell cell = tableView().dequeueReusableCellWithIdentifierForIndexPath(
                MY_CELL_IDENTIFIER, indexPath);
        cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);
        int index = (int) indexPath.row();
        cell.textLabel().setText(menuList.get(index).getCategory());
        return cell;
    }

}
