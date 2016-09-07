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
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.ios.platform.ui.NativeUtils;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;
import org.moe.natj.general.NatJ;
import org.moe.natj.general.Pointer;
import org.moe.natj.general.ann.Owned;
import org.moe.natj.general.ann.RegisterOnStartup;
import org.moe.natj.objc.ObjCRuntime;
import org.moe.natj.objc.ann.Selector;

import java.util.LinkedList;

import ios.coregraphics.c.CoreGraphics;
import ios.coregraphics.struct.CGRect;
import ios.foundation.NSIndexPath;
import ios.uikit.UIColor;
import ios.uikit.UIImageView;
import ios.uikit.UITableView;
import ios.uikit.UITableViewCell;
import ios.uikit.UITableViewController;
import ios.uikit.enums.UITableViewCellAccessoryType;

/**
 * The view controller for hosting the UIControls features of this sample.
 */
@org.moe.natj.general.ann.Runtime(ObjCRuntime.class)
@RegisterOnStartup
public class NewsViewController extends UITableViewController {

    static {
        NatJ.register();
    }

    @Owned
    @Selector("alloc")
    public static native NewsViewController alloc();

    @Selector("init")
    public native NewsViewController init();

    protected NewsViewController(Pointer peer) {
        super(peer);
    }

    private LinkedList<MenuListItem> menuList = new LinkedList<MenuListItem>();

    private final static String MY_CELL_IDENTIFIER = "MyTableViewCell";

    /**
     * Item storing meta data for menu items
     */
    private class MenuListItem {
        private String documentId;
        private String title;

        public MenuListItem(String documentId, String title) {
            this.documentId = documentId;
            this.title = title;
        }

        public String getDocumentId() {
            return documentId;
        }

        public String getTitle() {
            return title;
        }
    }

    private NewsDocumentController newsDocumentController;
    private String category;

    public String getCategory() {
        return category;
    }

    /**
     * construct the array of page descriptions we will use (each description is
     * a dictionary)
     */
    @Override
    public void viewDidLoad() {
        super.viewDidLoad();

        // <rect key="frame" x="0.0" y="64" width="320" height="416"/>
        CGRect tableViewBounds = CoreGraphics.CGRectMake(0.0, 64.0, 320, 247);
        setTableView(UITableView.alloc().initWithFrame(tableViewBounds));

        this.newsDocumentController = NewsDocumentController.alloc().init();

//        UIBarButtonItem temporaryBarButtonItem = new UIBarButtonItem();
//        temporaryBarButtonItem.setTitle("Back");
//        this.getNavigationItem().setBackBarButtonItem(temporaryBarButtonItem);

        tableView().registerClassForCellReuseIdentifier(
                new org.moe.natj.objc.Class("UITableViewCell"),
                MY_CELL_IDENTIFIER);
    }

    public void loadCategory(String category) {
        this.category = category;

        menuList.clear();
        try {
            Store s = NewsManifest.getNewsStore();
            Cursor c = s.getIndex("byCategory").openCursor();
            if(StringUtil.isNotEmpty(category) && !StringUtil.equals(category,NewsManifest.CATEGORY_ALL)) {
                c.partialKey(category);
            }
            c.find(new CursorHandler() {
                @Override
                public boolean handle(CursorEntry entry) throws JsonException {
                    menuList.add(new MenuListItem(entry.getUnid(),entry.getString("title")));
                    return true;
                }
            });
        } catch(Exception t) {
            Platform.log(t);
        }

        tableView().reloadData();
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
    public UITableViewCell tableViewCellForRowAtIndexPath(UITableView tableView,
                                                          NSIndexPath indexPath) {

        UITableViewCell cell = tableView().dequeueReusableCellWithIdentifierForIndexPath(
                MY_CELL_IDENTIFIER, indexPath);
        int index = (int) indexPath.row();
        MenuListItem item = menuList.get(index);
        UIImageView imageView = cell.imageView();
        if(imageView!=null) {
            NativeUtils.get().loadAttachmentImage(imageView, NewsManifest.NEWS_DATABASE,
                    NewsManifest.NEWS_STORE, item.getDocumentId(),NewsManifest.ATTACHMENT_NAME);
        }
        cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);
        cell.textLabel().setText(item.getTitle());
        return cell;
    }

    @Override
    public void tableViewDidSelectRowAtIndexPath(final UITableView tableView,
                                                 final NSIndexPath indexPath) {
        final int index = (int) indexPath.row();
        MenuListItem item = menuList.get(index);
        newsDocumentController.loadDocument(category, item.getDocumentId());
        this.navigationController().pushViewControllerAnimated(newsDocumentController, true);
    }

    @Override
    public long tableViewNumberOfRowsInSection(UITableView tableView, long section) {
        return menuList.size();
    }

}
