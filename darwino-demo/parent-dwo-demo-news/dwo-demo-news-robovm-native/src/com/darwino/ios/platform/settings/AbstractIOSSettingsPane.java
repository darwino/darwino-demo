/*
 * Copyright (C) 2014 RoboVM AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.darwino.ios.platform.settings;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.dispatch.DispatchQueue;
import org.robovm.apple.foundation.NSAttributedString;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.NSLayoutAttribute;
import org.robovm.apple.uikit.NSLayoutConstraint;
import org.robovm.apple.uikit.NSLayoutRelation;
import org.robovm.apple.uikit.UIAlertView;
import org.robovm.apple.uikit.UIBarButtonItem;
import org.robovm.apple.uikit.UIBarButtonItem.OnClickListener;
import org.robovm.apple.uikit.UIBarButtonSystemItem;
import org.robovm.apple.uikit.UIControl;
import org.robovm.apple.uikit.UILabel;
import org.robovm.apple.uikit.UIPickerView;
import org.robovm.apple.uikit.UIPickerViewDataSource;
import org.robovm.apple.uikit.UIPickerViewDataSourceAdapter;
import org.robovm.apple.uikit.UIPickerViewDelegate;
import org.robovm.apple.uikit.UIPickerViewDelegateAdapter;
import org.robovm.apple.uikit.UITableView;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellStyle;
import org.robovm.apple.uikit.UITableViewController;
import org.robovm.apple.uikit.UITableViewStyle;
import org.robovm.apple.uikit.UITextField;
import org.robovm.apple.uikit.UIView;

import com.darwino.commons.ios.ui.toast.Toast;
import com.darwino.commons.util.StringUtil;
import com.darwino.ios.platform.settings.controls.SettingsField;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.mobile.platform.settings.SettingsPane;
import com.darwino.platform.DarwinoManifest;

/**
 * This class is based on the same-named class from the "ContractR-ios" project in the RoboVM samples package
 */
public abstract class AbstractIOSSettingsPane extends UITableViewController implements SettingsPane {

	private List<UITableViewCell> cells = new ArrayList<>();
	private List<SettingsField> settingsFields = new ArrayList<>();

	public AbstractIOSSettingsPane() {
		super(UITableViewStyle.Grouped);
	}

	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
	}

	protected void addCell(UITableViewCell cell) {
		this.cells.add(cell);
	}

	protected void addSettingsField(SettingsField field) {
		this.settingsFields.add(field);
		addCell(field.getCell());
	}

	protected void addSettingsFields(SettingsField... fields) {
		for (SettingsField field : fields) {
			addSettingsField(field);
		}
	}

	public static UITableViewCell cell(String label, String subtitle, UIView view) {
		UITableViewCell cell = new UITableViewCell(UITableViewCellStyle.Subtitle, null);
		UILabel labelView = cell.getTextLabel();
		labelView.setText(label);

		if (StringUtil.isNotEmpty(subtitle)) {
			cell.getDetailTextLabel().setText(subtitle);
		}

		if (view != null) {
			cell.setUserInteractionEnabled(true);
			cell.setAccessoryView(view);
		}
		return cell;
	}

	@Override
	public UITableViewCell getCellForRow(UITableView tableView, NSIndexPath indexPath) {
		int row = (int) NSIndexPathExtensions.getRow(indexPath);
		return settingsFields.get(row).getCell();
	}

	@Override
	public long getNumberOfSections(UITableView tableView) {
		return 1;
	}

	@Override
	public long getNumberOfRowsInSection(UITableView tableView, long section) {
		return settingsFields.size();
	}

	@Override
	public void didSelectRow(UITableView tableView, NSIndexPath indexPath) {
		int row = (int) NSIndexPathExtensions.getRow(indexPath);
		switch (settingsFields.get(row).getType()) {
		case PICKER:
		case ACTION:
			settingsFields.get(row).trigger(this);
			break;
		case READ_ONLY:
			settingsFields.get(row).getCell().setSelected(false);
			break;
		default:
			break;
		}
	}

	public DarwinoMobileManifest getMobileManifest() {
		return DarwinoMobileApplication.get().getManifest().get(DarwinoMobileManifest.class);
	}

	public boolean isNative() {
		return DarwinoMobileApplication.get().isNative();
	}

	protected void alert(final String title, final String message) {
		DispatchQueue.getMainQueue().async(new Runnable() {
			@Override
			public void run() {
				UIAlertView alert = new UIAlertView(title, message, null, "OK");
				alert.show();
			}
		});
	}

	protected void toast(final String text) {
		Toast.makeText(text).show();
	}

	public DarwinoManifest getManifest() {
		return DarwinoMobileApplication.get().getManifest();
	}
}
