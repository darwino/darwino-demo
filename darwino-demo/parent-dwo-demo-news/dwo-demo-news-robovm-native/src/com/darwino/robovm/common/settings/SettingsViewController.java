package com.darwino.robovm.common.settings;

import java.io.File;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.NSArray;
import org.robovm.apple.foundation.NSBundle;
import org.robovm.apple.foundation.NSDictionary;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.foundation.NSMutableDictionary;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.foundation.NSString;
import org.robovm.apple.foundation.NSUserDefaults;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.UILabel;
import org.robovm.apple.uikit.UITableView;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellStyle;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.apple.uikit.UITableViewStyle;
import org.robovm.apple.uikit.UIView;
import org.robovm.apple.uikit.UIViewController;
import org.robovm.rt.bro.annotation.MachineSizedSInt;

import com.darwino.commons.util.StringUtil;


public class SettingsViewController extends UITableViewController {
	
	private class MyTableViewCell extends UITableViewCell {
		@Override
		protected long init (UITableViewCellStyle style, String reuseIdentifier) {
			return super.init(UITableViewCellStyle.Subtitle, reuseIdentifier);
		}
	}

	private final static String MY_CELL_IDENTIFIER = "MyTableViewCell2";
	
	private class ConfigPane {
		private final UIViewController controller;
		private final String title;
		private final String subtitle;
		
		public ConfigPane(UIViewController controller, String title, String subtitle) {
			this.controller = controller;
			this.title = title;
			this.subtitle = subtitle;
		}
		public UIViewController getController() {
			return controller;
		}
		public String getTitle() {
			return title;
		}
		public String getSubtitle() {
			return subtitle;
		}
	}
	
	private ConfigPane[] configPanes;
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		// Check to see if we need to initialize default settings
		NSUserDefaults defaults = NSUserDefaults.getStandardUserDefaults();
		NSObject server = defaults.get("serverKey");
		if(server == null) {
			registerDefaultsFromSettingsBundle();
		}

		this.configPanes = new ConfigPane[] {
			new ConfigPane(new AccountViewController(), "Account", "Set the current account"),
			new ConfigPane(new DataSyncViewController(), "Data Synchronization", "Manage the synchronization options"),
			new ConfigPane(new LocalDBViewController(), "Manage Local DB", "Create/Remove the local database"),
			new ConfigPane(new AboutViewController(), "About", "About this application")
		};
		
		getTableView().registerReusableCellClass(MyTableViewCell.class, MY_CELL_IDENTIFIER);
		
	}
	
	
	@Override
	public @MachineSizedSInt long getNumberOfRowsInSection(UITableView tableView,
			@MachineSizedSInt long section) {
		return configPanes.length;
	}
	
	@Override
	public UITableViewCell getCellForRow(UITableView tableView, NSIndexPath indexPath) {
		UITableViewCell cell = getTableView().dequeueReusableCell(MY_CELL_IDENTIFIER, indexPath);
		cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);

		int index = (int) NSIndexPathExtensions.getRow(indexPath);
		ConfigPane pane = configPanes[index];
		cell.getTextLabel().setText(pane.getTitle());
		
		String detailText = pane.getSubtitle();
		if(StringUtil.isNotEmpty(detailText)) {
			cell.getDetailTextLabel().setText(detailText);
		}
	
		return cell;
	}
	
	@Override
	public void didSelectRow(UITableView tableView, NSIndexPath indexPath) {
		int index = (int) NSIndexPathExtensions.getRow(indexPath);
		ConfigPane pane = configPanes[index];
		this.getNavigationController().pushViewController(pane.getController(), true);
	}
	
	// Via http://stackoverflow.com/questions/6291477/how-to-retrieve-values-from-settings-bundle-in-objective-c
	@SuppressWarnings("unchecked")
	private void registerDefaultsFromSettingsBundle() {
		String settingsBundle = NSBundle.getMainBundle().findResourcePath("Settings", "bundle");
		if(settingsBundle == null) {
			System.out.println("could not find settings bundle");
			return;
		}
		
		// TODO Have this look up from the Root.plist
		String[] prefGroups = {
			"Account",
			"DataSync"
		};
		
		NSMutableDictionary<NSObject, NSObject> defaultsToRegister = new NSMutableDictionary<>();
		NSUserDefaults userDefaults = NSUserDefaults.getStandardUserDefaults();
		
		for(String prefGroup : prefGroups) {
			NSDictionary<NSObject, NSObject> settings = (NSDictionary<NSObject, NSObject>) NSDictionary.read(new File(settingsBundle + "/" + prefGroup + ".plist"));
			NSArray<NSDictionary<NSObject, NSObject>> preferences = (NSArray<NSDictionary<NSObject, NSObject>>)settings.get(new NSString("PreferenceSpecifiers"));
			
			for(NSDictionary<NSObject, NSObject> prefSpecification : preferences) {
				NSString key = (NSString)prefSpecification.get(new NSString("Key"));
				if(key != null) {
					NSObject defaultValue = prefSpecification.get(new NSString("DefaultValue"));
					if(defaultValue != null) {
						// See if it's already set
						Object existingDefault = userDefaults.get(key.toString());
						if(existingDefault == null) {
							defaultsToRegister.put(key, defaultValue);
						}
					}
				}
			}
		}
		
		userDefaults.registerDefaults(defaultsToRegister);
	}
}
