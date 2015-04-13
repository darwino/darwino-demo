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

package com.darwino.demo.news.robovm;

import java.util.LinkedList;
import java.util.List;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.Foundation;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.foundation.NSMutableArray;
import org.robovm.apple.foundation.NSURL;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.UIApplication;
import org.robovm.apple.uikit.UIBarButtonItem;
import org.robovm.apple.uikit.UIBarButtonItemStyle;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UIScreen;
import org.robovm.apple.uikit.UITableView;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellStyle;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.apple.uikit.UIWindow;
import org.robovm.rt.bro.annotation.MachineSizedSInt;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.Platform;
import com.darwino.ios.platform.settings.IOSSettingsRoot;
import com.darwino.jsonstore.replication.ConsoleReplicationProgress;
import com.darwino.jsonstore.replication.ReplicationGroup;
import com.darwino.jsonstore.replication.ReplicationOptions;
import com.darwino.mobile.platform.DarwinoMobileApplication;

/**
 * The application's main view controller (front page)
 */
public class MainViewController extends UITableViewController {

	private LinkedList<MenuListItem> menuList = new LinkedList<MenuListItem>();

	private final static String MY_CELL_IDENTIFIER = "MyTableViewCell";

	private class MyTableViewCell extends UITableViewCell {
		@Override
		protected long init (UITableViewCellStyle style, String reuseIdentifier) {
			return super.init(UITableViewCellStyle.Subtitle, reuseIdentifier);
		}
	}

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

	public MainViewController() {
	}

	/**
	 * construct the array of page descriptions we will use (each description is
	 * a dictionary)
	 */
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();

		// <rect key="frame" x="0.0" y="64" width="320" height="416"/>
		CGRect tableViewBounds = new CGRect(0.0, 64.0, 320, 416);
		setTableView(new UITableView(tableViewBounds));

		// Add items to list where they will be retrieved when to display
		this.newsViewController = new NewsViewController();
		String[] cat = NewsManifest.getCategoryLabels();
		for(int i=0; i<cat.length; i++) {
			menuList.add(new MenuListItem(cat[i]));
		}

		createTopbar();
		createToolbar();

		getTableView().registerReusableCellClass(MyTableViewCell.class, MY_CELL_IDENTIFIER);
	}

	private void createTopbar() {
		UIBarButtonItem backButton = new UIBarButtonItem();
		backButton.setTitle("Back");
		this.getNavigationItem().setBackBarButtonItem(backButton);
	}

	private void createToolbar() {
		UIBarButtonItem onlineButtonItem = new UIBarButtonItem("Go Offline", UIBarButtonItemStyle.Plain, new UIBarButtonItem.OnClickListener() {
			@Override
			public void onClick(UIBarButtonItem barButtonItem) {
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
				} catch(Throwable t) {
					Platform.log(t);
				}
			}
		});
		UIBarButtonItem syncButtonItem = new UIBarButtonItem("Sync Data", UIBarButtonItemStyle.Plain, new UIBarButtonItem.OnClickListener() {
			@Override
			public void onClick(UIBarButtonItem barButtonItem) {
				System.out.println("SYNC DATA");
				try {
					DarwinoMobileApplication app = DarwinoMobileApplication.get();
					ReplicationGroup group = app.getManifest().getSynchronizationGroup();
					if(group!=null) {
						int sz = group.size();
						for(int i=0; i<sz; i++) {
							ReplicationOptions options = new ReplicationOptions(group.getProfile(i));
							options.setReplicationProgress(new ConsoleReplicationProgress());
							app.synchronize(group.getDatabase(i), options);
						}
					}
				} catch(Throwable t) {
					Platform.log(t);
				}
			}
		});
		UIBarButtonItem initButtonItem = new UIBarButtonItem("Init", UIBarButtonItemStyle.Plain, new UIBarButtonItem.OnClickListener() {
			@Override
			public void onClick(UIBarButtonItem barButtonItem) {
				System.out.println("INIT");
				try {
					DarwinoMobileApplication app = DarwinoMobileApplication.get();
					app.deleteLocalSqlLiteFile();
					app.createLocalDatabases(false);
				} catch(Throwable t) {
					Platform.log(t);
				}
			}
		});


		final IOSSettingsRoot settingsViewController = new IOSSettingsRoot();
		UIBarButtonItem settingsItem = new UIBarButtonItem("Settings", UIBarButtonItemStyle.Plain, new UIBarButtonItem.OnClickListener() {

			@Override
			public void onClick(UIBarButtonItem barButtonItem) {
				getNavigationController().pushViewController(settingsViewController, true);
			}
		});


		List<UIBarButtonItem> buttonSet = new LinkedList<UIBarButtonItem>();
		buttonSet.add(onlineButtonItem);
		buttonSet.add(syncButtonItem);
		buttonSet.add(initButtonItem);
		buttonSet.add(settingsItem);
		this.setToolbarItems(new NSMutableArray<UIBarButtonItem>(buttonSet));
		this.getNavigationController().setToolbarHidden(false);
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
		newsViewController.loadCategory(item.getCategory());
		this.getNavigationController().pushViewController(newsViewController, true);
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

		cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);
		cell.getTextLabel().setText(menuList.get((int) NSIndexPathExtensions.getRow(indexPath)).getCategory());
		//cell.getDetailTextLabel().setText(menuList.get((int) NSIndexPathExtensions.getRow(indexPath)).getExplanation());
		return cell;
	}

}
