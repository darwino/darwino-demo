package com.darwino.robovm.common.settings;

import java.util.Arrays;

import org.robovm.apple.uikit.UITableViewCell;


public class AccountViewController extends AbstractSettingsViewController {

	private static final String[] EXEC_MODE_LABELS = {
		"Remote Data",
		"Local Data",
	};
	private static final Object[] EXEC_MODE_VALUES = {
		1,
		2
	};
	
	protected SettingsField[] fields = {
			SettingsField.picker("Execution Mode", "execModeKey", Arrays.asList(EXEC_MODE_LABELS), Arrays.asList(EXEC_MODE_VALUES)),
			SettingsField.text("Server", "", "serverKey"),
			SettingsField.text("User Name", "", "userNameKey"),
			SettingsField.password("Password", "", "passwordKey")
	};
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		for(SettingsField field : fields) {
			addSettingsField(field);
		}
	}

	@Override
	protected void onSave() {
		for(SettingsField field : fields) {
			field.save();
		}

		getNavigationController().popViewController(true);
	}


}
