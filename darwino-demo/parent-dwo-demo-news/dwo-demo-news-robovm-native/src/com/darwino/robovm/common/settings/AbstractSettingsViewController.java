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
package com.darwino.robovm.common.settings;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.robovm.apple.foundation.NSAttributedString;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.NSLayoutAttribute;
import org.robovm.apple.uikit.NSLayoutConstraint;
import org.robovm.apple.uikit.NSLayoutRelation;
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

import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.DarwinoMobileManifest;
import com.darwino.robovm.common.settings.controls.SettingsField;

/**
 * This class is based on the same-named class from the "ContractR-ios" project in the RoboVM samples package
 */
public abstract class AbstractSettingsViewController extends UITableViewController {

	private List<UITableViewCell> cells = new ArrayList<>();
	private List<SettingsField> settingsFields = new ArrayList<>();

	public AbstractSettingsViewController() {
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
		for(SettingsField field : fields) {
			addSettingsField(field);
		}
	}

	public static UITableViewCell cell(String label, UIView view) {
		UITableViewCell cell = new UITableViewCell(UITableViewCellStyle.Subtitle, null);
		UILabel labelView = cell.getTextLabel();
		labelView.setText(label);
		if(view != null) {
			UIView contentView = cell.getContentView();
			contentView.addSubview(view);
	
			labelView.setTranslatesAutoresizingMaskIntoConstraints(false);
			view.setTranslatesAutoresizingMaskIntoConstraints(false);
	
			// labelView.left = contentView.left + 15
				contentView.addConstraint(NSLayoutConstraint.create(
						labelView, NSLayoutAttribute.Left,
						NSLayoutRelation.Equal,
						contentView, NSLayoutAttribute.Left,
						1, 15));
				// view.right = contentView.right - 15
				contentView.addConstraint(NSLayoutConstraint.create(
						view, NSLayoutAttribute.Right,
						NSLayoutRelation.Equal,
						contentView, NSLayoutAttribute.Right,
						1, -15));
				// view.centerY = contentView.centerY
				contentView.addConstraint(NSLayoutConstraint.create(
						view, NSLayoutAttribute.CenterY,
						NSLayoutRelation.Equal,
						contentView, NSLayoutAttribute.CenterY,
						1, 0));
				if (view instanceof UITextField) {
					// view.left = labelView.right + 15
					contentView.addConstraint(NSLayoutConstraint.create(
							view, NSLayoutAttribute.Left,
							NSLayoutRelation.Equal,
							labelView, NSLayoutAttribute.Right,
							1, 15));
				}
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
		if(settingsFields.get(row).getType() == SettingsField.Type.PICKER) {
			settingsFields.get(row).trigger(this);
		}
	}
	
	public DarwinoMobileManifest getMobileManifest() {
		return DarwinoMobileApplication.get().getManifest().get(DarwinoMobileManifest.class);
	}
	public boolean isNative() {
		return DarwinoMobileApplication.get().isNative();
	}
}
