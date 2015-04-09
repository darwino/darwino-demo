package com.darwino.robovm.common.settings.controls;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.robovm.apple.coregraphics.CGRect;
import org.robovm.apple.foundation.NSRange;
import org.robovm.apple.uikit.NSLayoutAttribute;
import org.robovm.apple.uikit.NSLayoutConstraint;
import org.robovm.apple.uikit.NSLayoutRelation;
import org.robovm.apple.uikit.NSTextAlignment;
import org.robovm.apple.uikit.UIControl;
import org.robovm.apple.uikit.UIControl.OnValueChangedListener;
import org.robovm.apple.uikit.UIColor;
import org.robovm.apple.uikit.UILabel;
import org.robovm.apple.uikit.UISwitch;
import org.robovm.apple.uikit.UITableViewCell;
import org.robovm.apple.uikit.UITableViewCellAccessoryType;
import org.robovm.apple.uikit.UITableViewCellSelectionStyle;
import org.robovm.apple.uikit.UITextField;
import org.robovm.apple.uikit.UITextFieldDelegateAdapter;
import org.robovm.apple.uikit.UIView;
import org.robovm.apple.uikit.UIViewController;

import com.darwino.commons.util.StringUtil;
import com.darwino.robovm.common.settings.AbstractSettingsViewController;

// TODO This should probably be split into subclasses - or there should be some standard way to do a lot of this
public class SettingsField extends UITextFieldDelegateAdapter {
	public enum Type {
		TEXT, PASSWORD, PICKER, BOOLEAN, ACTION, READ_ONLY
	}
	public static interface SettingsChangeCallback {
		void handle(SettingsField field, Object newValue);
	}
	public static interface SettingsActionCallback {
		void handle(SettingsField field);
	}
	
	private final SettingsField.Type type;
	private String label;
	private final Object defaultValue;
	private UITableViewCell cell;
	private final SettingsChangeCallback callback;
	private final SettingsActionCallback actionCallback;
	private String subtitle;
	
	// For field types
	private UIView field;

	// For picker types
	private final List<String> labels;
	private final List<Object> values;
	private MultiValuePicker picker;
	private UILabel pickerLabel;
	
	public static SettingsField text(String label, String subtitle, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.TEXT, label, subtitle, defaultValue, callback);
	}
	public static SettingsField password(String label, String subtitle, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.PASSWORD, label, subtitle, defaultValue, callback);
	}
	public static SettingsField picker(String label, String subtitle, Object defaultValue, Collection<String> labels, Collection<Object> values, SettingsChangeCallback callback) {
		return new SettingsField(Type.PICKER, label, subtitle, defaultValue, labels, values, callback);
	}
	public static SettingsField bool(String label, String subtitle, Object defaultValue, SettingsChangeCallback callback) {
		return new SettingsField(Type.BOOLEAN, label, subtitle, defaultValue, callback);
	}
	public static SettingsField action(String label, String subtitle, SettingsActionCallback callback) {
		return new SettingsField(Type.ACTION, label, subtitle, callback);
	}
	public static SettingsField readOnly(String label, String subtitle, Object value) {
		return new SettingsField(Type.READ_ONLY, label, subtitle, value);
	}
	
	private SettingsField(SettingsField.Type type, String label, String subtitle, SettingsActionCallback callback) {
		this.type = type;
		this.label = label;
		this.subtitle = subtitle;
		this.defaultValue = null;
		this.labels = null;
		this.values = null;
		this.callback = null;
		this.actionCallback = callback;
	}
	private SettingsField(SettingsField.Type type, String label, String subtitle, Object defaultValue, SettingsChangeCallback callback) {
		this.type = type;
		this.label = label;
		this.subtitle = subtitle;
		this.defaultValue = defaultValue;
		this.labels = null;
		this.values = null;
		this.callback = callback;
		this.actionCallback = null;
	}
	private SettingsField(SettingsField.Type type, String label, String subtitle, Object defaultValue, Collection<String> labels, Collection<Object> values, SettingsChangeCallback callback) {
		this.type = type;
		this.label = label;
		this.subtitle = subtitle;
		this.defaultValue = defaultValue;
		this.labels = new ArrayList<>(labels);
		this.values = new ArrayList<>(values);
		this.callback = callback;
		this.actionCallback = null;
	}
	private SettingsField(SettingsField.Type type, String label, String subtitle, Object value) {
		this.type = type;
		this.label = label;
		this.subtitle = subtitle;
		this.defaultValue = value;
		this.labels = null;
		this.values = null;
		this.callback = null;
		this.actionCallback = null;
	}
	
	public SettingsField.Type getType() {
		return type;
	}
	
	public void setLabel(String label) {
		// TODO refactor down
		UILabel labelView = getCell().getTextLabel();
		this.label = label;
        labelView.setText(label);
	}
	public void setSubtitle(String subtitle) {
		getCell().getDetailTextLabel().setText(subtitle);
	}
	
	private UITextField createTextField(String defaultValue) {
		UITextField textField = new UITextField();
		textField.setTextAlignment(NSTextAlignment.Right);
		if(defaultValue != null && StringUtil.isNotEmpty(String.valueOf(defaultValue))) {
			textField.setText(String.valueOf(defaultValue));
		}
		// TODO Look back into auto-resizing for these
		textField.setBounds(new CGRect(0, 0, 200, 43));

		textField.setDelegate(this);
		return textField;
	}
	
	public UIView getField() {
		if(field == null) {
			switch(type) {
				case TEXT: {
					UITextField textField = createTextField((String)defaultValue);
					field = textField;
					
					break;
				}
				case PASSWORD: {
					UITextField textField = createTextField((String)defaultValue);
					textField.setSecureTextEntry(true);
					field = textField;
					
					break;
				}
				case BOOLEAN: {
					UISwitch switchField = new UISwitch();
					switchField.setOn((Boolean)defaultValue);
					switchField.addOnValueChangedListener(new OnValueChangedListener() {
						@Override public void onValueChanged(UIControl control) {
							callback.handle(SettingsField.this, Boolean.valueOf(((UISwitch)field).isOn()));
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
					this.cell = AbstractSettingsViewController.cell(getLabel(), subtitle, getField());
					break;
				case ACTION:
					this.cell = AbstractSettingsViewController.cell(getLabel(), subtitle, null);
					break;
				case READ_ONLY: {
					String valueText = defaultValue == null ? "" : String.valueOf(defaultValue);
					if(StringUtil.isNotEmpty(valueText)) {
						UILabel label = new UILabel();
						label.setText(valueText);
						this.cell = AbstractSettingsViewController.cell(getLabel(), subtitle, label);
					} else {
						this.cell = AbstractSettingsViewController.cell(getLabel(), subtitle, null);
					}
					this.cell.setSelectionStyle(UITableViewCellSelectionStyle.None);
					
					break;
				}
				case PICKER: {
					UITableViewCell cell = new UITableViewCell();
					cell.setAccessoryType(UITableViewCellAccessoryType.DisclosureIndicator);
			        UILabel labelView = cell.getTextLabel();
			        labelView.setText(getLabel());
			        
			        if(StringUtil.isNotEmpty(subtitle)) {
			        	cell.getDetailTextLabel().setText(subtitle);
			        }
			        
			        
					UIView contentView = cell.getContentView();
					this.pickerLabel = new UILabel();
					this.pickerLabel.setTextColor(UIColor.gray());
			        contentView.addSubview(pickerLabel);
			        
			        int labelIndex = values.indexOf(defaultValue);
			        
			        if(labelIndex > -1) {
			        	pickerLabel.setText(labels.get(labelIndex));
			        }

			        
			        pickerLabel.setTranslatesAutoresizingMaskIntoConstraints(false);

			        // view.right = contentView.right - 15
			        contentView.addConstraint(NSLayoutConstraint.create(
			        		pickerLabel, NSLayoutAttribute.Right,
			                NSLayoutRelation.Equal,
			                contentView, NSLayoutAttribute.Right,
			                1, 0));
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
		switch(type) {
			case PICKER: {
				if(this.picker == null) {
					picker = new MultiValuePicker(labels, values, defaultValue, new MultiValuePicker.MultiValuePickerCallback() {
						@Override
						public void handle(Object pickedValue) {
							int index = values.indexOf(pickedValue);
							pickerLabel.setText(labels.get(index));
							
							callback.handle(SettingsField.this, pickedValue);
						}
					});
				}
				controller.getNavigationController().pushViewController(picker, true);
				break;
			}
			case ACTION: {
				this.actionCallback.handle(SettingsField.this);
				getCell().setSelected(false);
				break;
			}
			default:
				break;
		}
	}
	
	public String getLabel() {
		return label;
	}
	
	// Text-field delegate duties
	@Override
	public void didEndEditing(UITextField textField) {
		callback.handle(this, textField.getText());
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