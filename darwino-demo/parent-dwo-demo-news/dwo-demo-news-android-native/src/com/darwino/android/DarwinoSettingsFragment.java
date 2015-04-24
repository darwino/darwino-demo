package com.darwino.android;

import java.util.List;

import com.darwino.android.platform.AndroidUIHelper;
import com.darwino.android.ui.AndroidDialogs;
import com.darwino.commons.util.NotImplementedException;
import com.darwino.commons.util.StringUtil;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.mobile.platform.settings.SettingsRoot;
import com.darwino.mobile.platform.settings.controls.AbstractSettingsPage;
import com.darwino.mobile.platform.settings.controls.AbstractValueSettingsField;
import com.darwino.mobile.platform.settings.controls.ActionSettingsField;
import com.darwino.mobile.platform.settings.controls.PickerSettingsField;
import com.darwino.mobile.platform.settings.controls.SettingsControl;
import com.darwino.mobile.platform.settings.controls.SettingsField;

import android.os.Bundle;
import android.preference.CheckBoxPreference;
import android.preference.DialogPreference;
import android.preference.EditTextPreference;
import android.preference.ListPreference;
import android.preference.Preference;
import android.preference.Preference.OnPreferenceChangeListener;
import android.preference.Preference.OnPreferenceClickListener;
import android.preference.PreferenceFragment;
import android.preference.PreferenceScreen;
import android.text.InputType;
import android.widget.EditText;

public class DarwinoSettingsFragment extends PreferenceFragment {
	
	@Override
	public void onDestroy() {
		SettingsRoot.getInstance().save();
		
		super.onDestroy();
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		final PreferenceScreen screen = getPreferenceManager().createPreferenceScreen(getActivity());
		setPreferenceScreen(screen);
		
		Bundle arguments = getArguments();

		SettingsRoot settingsRoot = SettingsRoot.getInstance();
		List<SettingsControl> children = settingsRoot.getChildren();
		int index = arguments.getInt("settingsPageIndex");
		
		AbstractSettingsPage page = (AbstractSettingsPage)children.get(index);
		for(SettingsControl child : page.getChildren()) {
			if(child instanceof SettingsField) {
				SettingsField settingsField = (SettingsField)child;
				switch(settingsField.getType()) {
				case TEXT: {
					final AbstractValueSettingsField valueField = (AbstractValueSettingsField)settingsField;
					EditTextPreference preference = new EditTextPreference(getActivity());
					preference.setTitle(valueField.getTitle());
					preference.setDialogTitle(valueField.getTitle());
					preference.setText((String)valueField.getDefaultValue());
					preference.getEditText().setMaxLines(1);
					preference.getEditText().setSelectAllOnFocus(true);
					preference.getEditText().setSingleLine();
					
					final boolean valueSummary = StringUtil.isEmpty(valueField.getSubtitle());
					if(valueSummary) {
						preference.setSummary((String)valueField.getDefaultValue());
					} else {
						preference.setSummary(valueField.getSubtitle());
					}
					
					preference.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
						@Override public boolean onPreferenceChange(Preference preference, Object newValue) {
							valueField.getCallback().handle(valueField, newValue);
							if(valueSummary) {
								preference.setSummary((String)newValue);
							}
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					break;
				}
				case PASSWORD: {
					final AbstractValueSettingsField valueField = (AbstractValueSettingsField)settingsField;
					EditTextPreference preference = new EditTextPreference(getActivity());
					preference.getEditText().setInputType(InputType.TYPE_TEXT_VARIATION_PASSWORD);
					preference.setTitle(valueField.getTitle());
					preference.setDialogTitle(valueField.getTitle());
					preference.setText((String)valueField.getDefaultValue());
					
					final boolean valueSummary = StringUtil.isEmpty(valueField.getSubtitle());
					if(valueSummary) {
						preference.setSummary(StringUtil.repeat('*', ((String)valueField.getDefaultValue()).length()));
					} else {
						preference.setSummary(valueField.getSubtitle());
					}
					
					preference.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
						@Override public boolean onPreferenceChange(Preference preference, Object newValue) {
							valueField.getCallback().handle(valueField, newValue);
							if(valueSummary) {
								preference.setSummary(StringUtil.repeat('*', ((String)newValue).length()));
							}
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					break;
				}
				case BOOLEAN: {
					final AbstractValueSettingsField valueField = (AbstractValueSettingsField)settingsField;
					CheckBoxPreference preference = new CheckBoxPreference(getActivity());
					preference.setTitle(valueField.getTitle());
					preference.setSummary(valueField.getSubtitle());
					preference.setChecked(Boolean.TRUE.equals(valueField.getDefaultValue()));
					
					preference.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
						@Override public boolean onPreferenceChange(Preference preference, Object newValue) {
							valueField.getCallback().handle(valueField, newValue);
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					break;
				}
				case PICKER: {
					final PickerSettingsField valueField = (PickerSettingsField)settingsField;
					ListPreference preference = new ListPreference(getActivity());
					preference.setTitle(valueField.getTitle());
					preference.setDialogTitle(valueField.getTitle());
					int valueIndex = valueField.getValues().indexOf(valueField.getDefaultValue());
					preference.setDefaultValue(valueField.getLabels().get(valueIndex));
					String[] labels = valueField.getLabels().toArray(new String[valueField.getLabels().size()]);
					preference.setEntries(labels);
					preference.setEntryValues(labels);
					
					final boolean valueSummary = StringUtil.isEmpty(valueField.getSubtitle());
					if(valueSummary) {
						if(valueIndex > -1) {
							preference.setSummary(valueField.getLabels().get(valueIndex));
						}
					} else {
						preference.setSummary(valueField.getSubtitle());
					}
					
					preference.setOnPreferenceChangeListener(new OnPreferenceChangeListener() {
						@Override public boolean onPreferenceChange(Preference preference, Object newValue) {
							int valueIndex = valueField.getLabels().indexOf(newValue);
							valueField.getCallback().handle(valueField, valueField.getValues().get(valueIndex));
							if(valueSummary) {
								preference.setSummary((String)newValue);
							}
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					
					break;
				}
				case READ_ONLY: {
					Preference preference = new Preference(getActivity());
					preference.setTitle(settingsField.getTitle());
					preference.setSummary(settingsField.getSubtitle());
					preference.setOnPreferenceClickListener(new OnPreferenceClickListener() {
						@Override public boolean onPreferenceClick(Preference preference) {
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					
					break;
				}
				case ACTION: {
					final ActionSettingsField actionField = (ActionSettingsField)settingsField;
					Preference preference = new Preference(getActivity());
					preference.setTitle(actionField.getTitle());
					preference.setSummary(actionField.getSubtitle());
					preference.setOnPreferenceClickListener(new OnPreferenceClickListener() {
						@Override public boolean onPreferenceClick(Preference preference) {
							actionField.getCallback().handle(actionField);
							return true;
						}
					});
					getPreferenceScreen().addPreference(preference);
					
					break;
				}
				case ACTION_PICKER: {
					break;
				}
				case OTHER: {
					break;
				}
				}
			} else if(child instanceof AbstractSettingsPage) {
				throw new NotImplementedException("Nested settings panes not implemented");
			}
		}
	}
}
