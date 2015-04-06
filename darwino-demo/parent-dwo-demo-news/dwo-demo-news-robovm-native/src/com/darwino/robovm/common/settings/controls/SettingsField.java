package com.darwino.robovm.common.settings.controls;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.robovm.apple.foundation.NSRange;
import org.robovm.apple.uikit.NSLayoutAttribute;
import org.robovm.apple.uikit.NSLayoutConstraint;
import org.robovm.apple.uikit.NSLayoutRelation;
import org.robovm.apple.uikit.NSTextAlignment;
import org.robovm.apple.uikit.UIControl;
import org.robovm.apple.uikit.UIControl.OnValueChangedListener;
import org.robovm.apple.uikit.UILabel;
import org.robovm.apple.uikit.UISwitch;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITextField;
import org.robovm.apple.uikit.UITextFieldDelegateAdapter;
import org.robovm.apple.uikit.UIView;
import org.robovm.apple.uikit.UIViewController;

import com.darwino.commons.util.StringUtil;
import com.darwino.robovm.common.settings.AbstractSettingsViewController;

public class SettingsField extends UITextFieldDelegateAdapter {
	public enum Type {
		TEXT, PASSWORD, PICKER, BOOLEAN
	}
	public static interface SettingsChangeCallback {
		void handle(Object newValue);
	}
	
	private final SettingsField.Type type;
	private final String label;
	private final Object defaultValue;
	private UITableViewCell cell;
	private final SettingsChangeCallback callback;
	
	// For field types
	private UIView field;
	private final String placeholder;

	// For picker types
	private final List<String> labels;
	private final List<Object> values;
	private MultiValuePicker picker;
	private UILabel pickerLabel;
	
	public static SettingsField text(String label, String placeholder, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.TEXT, label, placeholder, defaultValue, callback);
	}
	public static SettingsField password(String label, String placeholder, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.PASSWORD, label, placeholder, defaultValue, callback);
	}
	public static SettingsField picker(String label, Object defaultValue, Collection<String> labels, Collection<Object> values, SettingsChangeCallback callback) {
		return new SettingsField(Type.PICKER, label, defaultValue, labels, values, callback);
	}
	public static SettingsField bool(String label, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.BOOLEAN, label, defaultValue, callback);
	}
	
	private SettingsField(SettingsField.Type type, String label, Object defaultValue, SettingsChangeCallback callback) {
		this.type = type;
		this.label = label;
		this.placeholder = "";
		this.defaultValue = defaultValue;
		this.labels = null;
		this.values = null;
		this.callback = callback;
	}
	private SettingsField(SettingsField.Type type, String label, String placeholder, Object defaultValue, SettingsChangeCallback callback) {
		this.type = type;
		this.label = label;
		this.placeholder = placeholder;
		this.defaultValue = defaultValue;
		this.labels = null;
		this.values = null;
		this.callback = callback;
	}
	private SettingsField(SettingsField.Type type, String label, Object defaultValue, Collection<String> labels, Collection<Object> values, SettingsChangeCallback callback) {
		this.type = type;
		this.label = label;
		this.placeholder = null;
		this.defaultValue = defaultValue;
		this.labels = new ArrayList<>(labels);
		this.values = new ArrayList<>(values);
		this.callback = callback;
	}
	
	public SettingsField.Type getType() {
		return type;
	}
	
	public UIView getField() {
		if(field == null) {
			switch(type) {
				case TEXT: {
					UITextField textField = new UITextField();
					textField.setPlaceholder(placeholder);
					textField.setTextAlignment(NSTextAlignment.Right);
					if(defaultValue != null && StringUtil.isNotEmpty(String.valueOf(defaultValue))) {
						textField.setText(String.valueOf(defaultValue));
					}
					
					textField.setDelegate(this);
					
					field = textField;
					break;
				}
				case PASSWORD: {
					UITextField textField = new UITextField();
					textField.setPlaceholder(placeholder);
					textField.setTextAlignment(NSTextAlignment.Right);
					textField.setSecureTextEntry(true);
					if(defaultValue != null && StringUtil.isNotEmpty(String.valueOf(defaultValue))) {
						textField.setText(String.valueOf(defaultValue));
					}
					
					textField.setDelegate(this);
					field = textField;
					
					break;
				}
				case BOOLEAN: {
					UISwitch switchField = new UISwitch();
					switchField.setOn((Boolean)defaultValue);
					switchField.addOnValueChangedListener(new OnValueChangedListener() {
						@Override public void onValueChanged(UIControl control) {
							callback.handle(Boolean.valueOf(((UISwitch)field).isOn()));
						}
					});
					field = switchField;
					
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
				case BOOLEAN:
					this.cell = AbstractSettingsViewController.cell(getLabel(), getField());
					break;
				case PICKER: {
					UITableViewCell cell = new UITableViewCell();
			        UILabel labelView = cell.getTextLabel();
			        labelView.setText(getLabel());
					UIView contentView = cell.getContentView();
					this.pickerLabel = new UILabel();
			        contentView.addSubview(pickerLabel);
			        
			        int labelIndex = values.indexOf(defaultValue);
			        
			        if(labelIndex > -1) {
			        	pickerLabel.setText(labels.get(labelIndex));
			        }

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
		if(this.picker == null) {
			picker = new MultiValuePicker(labels, values, defaultValue, new MultiValuePicker.MultiValuePickerCallback() {
				@Override
				public void handle(Object pickedValue) {
					int index = values.indexOf(pickedValue);
					pickerLabel.setText(labels.get(index));
					
					callback.handle(pickedValue);
				}
			});
		}
		controller.getNavigationController().pushViewController(picker, true);
	}
	
	public String getLabel() {
		return label;
	}
	
	// Text-field delegate duties
	@Override
	public void didEndEditing(UITextField textField) {
		callback.handle(textField.getText());
	}
	@Override
	public boolean shouldReturn(UITextField textField) {
		textField.resignFirstResponder();
		return false;
	}
	
	@Override
	public boolean shouldBeginEditing(UITextField textField) {
		return true;
	}
	@Override
	public void didBeginEditing(UITextField textField) {
	}
	@Override
	public boolean shouldEndEditing(UITextField textField) {
		return true;
	}
	@Override
	public boolean shouldChangeCharacters(UITextField textField, NSRange range, String string) {
		return true;
	}
	@Override
	public boolean shouldClear(UITextField textField) {
		return true;
	}
	
	
	
//	public void save() {
//		DarwinoMobileSettings.Editor editor = SettingsViewController.getInstance().getSettingsEditor();
//		
//		switch(type) {
//			case TEXT:
//			case PASSWORD: {
//				String value = ((UITextField)getField()).getText();
//				defaults.put(defaultsKey, value);
//				break;
//			}
//			case PICKER: {
//				Object selectedValue = values.get(selectedIndex);
//				if(selectedValue instanceof Boolean) {
//					defaults.put(defaultsKey, (Boolean)selectedValue);
//				} else if(selectedValue instanceof Long || selectedValue instanceof Integer || selectedValue instanceof Short) {
//					defaults.put(defaultsKey, ((Number)selectedValue).longValue());
//				} else if(selectedValue instanceof Double || selectedValue instanceof Float) {
//					defaults.put(defaultsKey, ((Number)selectedValue).doubleValue());
//				} else if(selectedValue instanceof NSURL) {
//					defaults.put(defaultsKey, (NSURL)selectedValue);
//				} else if(selectedValue instanceof URI) {
//					defaults.put(defaultsKey, new NSURL((URI)selectedValue));
//				} else if(selectedValue instanceof NSObject) {
//					defaults.put(defaultsKey, (NSObject)selectedValue);
//				} else if(selectedValue == null) {
//					defaults.remove(defaultsKey);
//				} else {
//					defaults.put(defaultsKey, String.valueOf(selectedValue));
//				}
//			}
//		}
//	}
}