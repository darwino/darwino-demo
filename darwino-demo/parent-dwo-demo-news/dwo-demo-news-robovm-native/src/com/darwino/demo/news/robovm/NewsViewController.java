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

package com.darwino.demo.news.robovm;

import java.util.LinkedList;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UIImageView;
import org.robovm.apple.uikit.UITableView;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellStyle;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.rt.bro.annotation.MachineSizedSInt;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.StringUtil;
import com.darwino.ios.platform.ui.NativeUtils;
import com.darwino.jsonstore.Cursor;
import com.darwino.jsonstore.Store;
import com.darwino.jsonstore.callback.CursorEntry;
import com.darwino.jsonstore.callback.CursorHandler;

/**
 * The view controller for hosting the UIControls features of this sample.
 */
public class NewsViewController extends UITableViewController {

    private LinkedList<MenuListItem> menuList = new LinkedList<MenuListItem>();

    private final static String MY_CELL_IDENTIFIER = "MyTableViewCell";

    public static class MyTableViewCell extends UITableViewCell {
        public MyTableViewCell(UITableViewCellStyle style, String reuseIdentifier) {
            super(UITableViewCellStyle.Default, reuseIdentifier);
        }
    }

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
    
    public NewsViewController() {
    }
    
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
        CGRect tableViewBounds = new CGRect(0.0, 64.0, 320, 247);
        setTableView(new UITableView(tableViewBounds));
        
        this.newsDocumentController = new NewsDocumentController();

//        UIBarButtonItem temporaryBarButtonItem = new UIBarButtonItem();
//        temporaryBarButtonItem.setTitle("Back");
//        this.getNavigationItem().setBackBarButtonItem(temporaryBarButtonItem);

        getTableView().registerReusableCellClass(MyTableViewCell.class, MY_CELL_IDENTIFIER);
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

    	getTableView().reloadData();
    }

    @Override
    public void viewWillAppear(boolean animated) {
        super.viewWillAppear(animated);
        
        // this UIViewController is about to re-appear, make sure we remove the
        // current selection in our table view
        NSIndexPath tableSelection = this.getTableView().getIndexPathForSelectedRow();
        this.getTableView().deselectRow(tableSelection, false);

        // some over view controller could have changed our nav bar tint color,
        // so reset it here
        this.getNavigationController().getNavigationBar().setTintColor(UIColor.darkGray());
    }

    /**
     * the table's selection has changed, switch to that item's UIViewController
     */
    @Override
    public void didSelectRow(UITableView tableView, NSIndexPath indexPath) {
        MenuListItem item = menuList.get((int) NSIndexPathExtensions.getRow(indexPath));
        newsDocumentController.loadDocument(category, item.getDocumentId());
        this.getNavigationController().pushViewController(newsDocumentController, true);
    }

    @Override
    public @MachineSizedSInt long getNumberOfRowsInSection(UITableView tableView,
            @MachineSizedSInt long section) {
        return menuList.size();
    }

    @Override
	public UITableViewCell getCellForRow(UITableView tableView,
			NSIndexPath indexPath) {
        UITableViewCell cell = getTableView().dequeueReusableCell(MY_CELL_IDENTIFIER, indexPath);

    	MenuListItem item = menuList.get((int) NSIndexPathExtensions.getRow(indexPath));
        UIImageView imageView = cell.getImageView();
        if(imageView!=null) {
      		NativeUtils.get().loadAttachmentImage(imageView, NewsManifest.NEWS_DATABASE, NewsManifest.NEWS_STORE, item.getDocumentId(),NewsManifest.ATTACHMENT_NAME);        	
        }
        cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);
        cell.getTextLabel().setText(item.getTitle());
        return cell;
    }
}
