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

import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.robovm.apple.foundation.NSAttributedString;
import org.robovm.apple.foundation.NSIndexPath;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.foundation.NSURL;
import org.robovm.apple.foundation.NSUserDefaults;
import org.robovm.apple.uikit.NSIndexPathExtensions;
import org.robovm.apple.uikit.NSLayoutAttribute;
import org.robovm.apple.uikit.NSLayoutConstraint;
import org.robovm.apple.uikit.NSLayoutRelation;
import org.robovm.apple.uikit.UIBarButtonItem;
import org.robovm.apple.uikit.UIBarButtonItem.OnClickListener;
import org.robovm.apple.uikit.NSTextAlignment;
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
import org.robovm.apple.uikit.UIViewController;

import com.darwino.commons.util.StringUtil;
import com.darwino.robovm.common.settings.controls.MultiValuePicker;
import com.darwino.robovm.common.settings.controls.MultiValuePicker.MultiValuePickerCallback;

/**
 * This class is based on the same-named class from the "ContractR-ios" project in the RoboVM samples package
 */
public abstract class AbstractSettingsViewController extends UITableViewController {

	protected static class SettingsField {
		public enum Type {
			TEXT, PASSWORD, PICKER
		}
		
		private final Type type;
		private final String label;
		private final String defaultsKey;
		UITableViewCell cell;
		
		// For field types
		private UIView field;
		private final String placeholder;

		// For picker types
		private final List<String> labels;
		private final List<Object> values;
		private int selectedIndex;
		private MultiValuePicker picker;
		private UILabel pickerLabel;
		
		// For general use
		private NSUserDefaults defaults = NSUserDefaults.getStandardUserDefaults();
		
		public static SettingsField text(String label, String placeholder, String defaultsKey) {
			return new SettingsField(Type.TEXT, label, placeholder, defaultsKey);
		}
		public static SettingsField password(String label, String placeholder, String defaultsKey) {
			return new SettingsField(Type.PASSWORD, label, placeholder, defaultsKey);
		}
		public static SettingsField picker(String label, String defaultsKey, Collection<String> labels, Collection<Object> values) {
			return new SettingsField(Type.PICKER, label, defaultsKey, labels, values);
		}
		
		private SettingsField(Type type, String label, String placeholder, String defaultsKey) {
			this.type = type;
			this.label = label;
			this.placeholder = placeholder;
			this.defaultsKey = defaultsKey;
			this.labels = null;
			this.values = null;
		}
		private SettingsField(Type type, String label, String defaultsKey, Collection<String> labels, Collection<Object> values) {
			this.type = type;
			this.label = label;
			this.placeholder = null;
			this.defaultsKey = defaultsKey;
			this.labels = new ArrayList<>(labels);
			this.values = new ArrayList<>(values);
		}
		
		public UIView getField() {
			if(field == null) {
				switch(type) {
					case TEXT: {
						UITextField textField = new UITextField();
						textField.setPlaceholder(placeholder);
						textField.setTextAlignment(NSTextAlignment.Right);
						NSObject serverDefault = defaults.get(defaultsKey);
						if(serverDefault != null && StringUtil.isNotEmpty(serverDefault.toString())) {
							textField.setText(serverDefault.toString());
						}
						field = textField;
						break;
					}
					case PASSWORD: {
						UITextField textField = new UITextField();
						textField.setPlaceholder(placeholder);
						textField.setTextAlignment(NSTextAlignment.Right);
						textField.setSecureTextEntry(true);
						NSObject serverDefault = defaults.get(defaultsKey);
						if(serverDefault != null && StringUtil.isNotEmpty(serverDefault.toString())) {
							textField.setText(serverDefault.toString());
						}
						field = textField;
						break;
					}
					default:
						field = null;
						break;
				}
			}
			return field;
		}
		
		public UITableViewCell getCell() {
			if(this.cell == null) {
				switch(type) {
					case PASSWORD:
					case TEXT:
						this.cell = cell(getLabel(), getField());
						break;
					case PICKER: {
						UITableViewCell cell = new UITableViewCell();
				        UILabel labelView = cell.getTextLabel();
				        labelView.setText(getLabel());
						UIView contentView = cell.getContentView();
						this.pickerLabel = new UILabel();
				        contentView.addSubview(pickerLabel);

				        labelView.setTranslatesAutoresizingMaskIntoConstraints(false);
				        pickerLabel.setTranslatesAutoresizingMaskIntoConstraints(false);

				        // labelView.left = contentView.left + 15
				        contentView.addConstraint(NSLayoutConstraint.create(
				                labelView, NSLayoutAttribute.Left,
				                NSLayoutRelation.Equal,
				                contentView, NSLayoutAttribute.Left,
				                1, 15));
				        // view.right = contentView.right - 15
				        contentView.addConstraint(NSLayoutConstraint.create(
				        		pickerLabel, NSLayoutAttribute.Right,
				                NSLayoutRelation.Equal,
				                contentView, NSLayoutAttribute.Right,
				                1, -15));
				        // view.centerY = contentView.centerY
				        contentView.addConstraint(NSLayoutConstraint.create(
				        		pickerLabel, NSLayoutAttribute.CenterY,
				                NSLayoutRelation.Equal,
				                contentView, NSLayoutAttribute.CenterY,
				                1, 0));
						this.cell = cell;
						break;
					}
				}
			}
			return cell;
		}
		
		public void trigger(UIViewController controller) {
			picker = new MultiValuePicker(labels, values, new MultiValuePickerCallback() {
				@Override
				public void handle(Object pickedValue) {
					int index = values.indexOf(pickedValue);
					setSelectedIndex(index);
					pickerLabel.setText(labels.get(index));
				}
			});
			controller.getNavigationController().pushViewController(picker, true);
		}
		
		protected void setSelectedIndex(int index) {
			this.selectedIndex = index;
		}
		
		public String getLabel() {
			return label;
		}
		
		public void save() {
			switch(type) {
				case TEXT:
				case PASSWORD: {
					String value = ((UITextField)getField()).getText();
					defaults.put(defaultsKey, value);
					break;
				}
				case PICKER: {
					Object selectedValue = values.get(selectedIndex);
					if(selectedValue instanceof Boolean) {
						defaults.put(defaultsKey, (Boolean)selectedValue);
					} else if(selectedValue instanceof Long || selectedValue instanceof Integer || selectedValue instanceof Short) {
						defaults.put(defaultsKey, ((Number)selectedValue).longValue());
					} else if(selectedValue instanceof Double || selectedValue instanceof Float) {
						defaults.put(defaultsKey, ((Number)selectedValue).doubleValue());
					} else if(selectedValue instanceof NSURL) {
						defaults.put(defaultsKey, (NSURL)selectedValue);
					} else if(selectedValue instanceof URI) {
						defaults.put(defaultsKey, new NSURL((URI)selectedValue));
					} else if(selectedValue instanceof NSObject) {
						defaults.put(defaultsKey, (NSObject)selectedValue);
					} else if(selectedValue == null) {
						defaults.remove(defaultsKey);
					} else {
						defaults.put(defaultsKey, String.valueOf(selectedValue));
					}
				}
			}
		}
	}
	
	private List<UITableViewCell> cells = new ArrayList<>();
	private List<SettingsField> settingsFields = new ArrayList<>();

	public AbstractSettingsViewController() {
		super(UITableViewStyle.Grouped);
	}

	@Override
	public void viewDidLoad() {
		super.viewDidLoad();

		getNavigationItem().setRightBarButtonItem(
				new UIBarButtonItem(UIBarButtonSystemItem.Done, new OnClickListener() {
					@Override
					public void onClick(UIBarButtonItem barButtonItem) {
						onSave();
					}
				}));
	}

	protected abstract void onSave();
	
	protected void addCell(UITableViewCell cell) {
		this.cells.add(cell);
	}
	protected void addSettingsField(SettingsField field) {
		this.settingsFields.add(field);
		addCell(field.getCell());
	}

	protected static UITableViewCell cell(String label, UIView view) {
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
		if(settingsFields.get(row).type == SettingsField.Type.PICKER) {
			settingsFields.get(row).trigger(this);
		}
	}
}
