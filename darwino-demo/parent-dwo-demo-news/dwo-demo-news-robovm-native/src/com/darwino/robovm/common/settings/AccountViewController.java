package com.darwino.robovm.common.settings;

import org.robovm.apple.foundation.NSBundle;
import org.robovm.apple.foundation.NSObject;
import org.robovm.apple.foundation.NSUserDefaults;
import org.robovm.apple.uikit.NSTextAlignment;
import org.robovm.apple.uikit.UITextField;

import com.darwino.commons.util.StringUtil;


public class AccountViewController extends AbstractSettingsViewController {

	private UITextField serverTextField;
	
	@Override
	public void viewDidLoad() {
		super.viewDidLoad();
		
		NSUserDefaults defaults = NSUserDefaults.getStandardUserDefaults();
		
		serverTextField = new UITextField();
		serverTextField.setPlaceholder("Enter server name");
		serverTextField.setTextAlignment(NSTextAlignment.Right);
		NSObject serverDefault = defaults.get("serverKey");
		System.out.println("serverDefault is " + serverDefault);
		if(serverDefault != null && StringUtil.isNotEmpty(serverDefault.toString())) {
			serverTextField.setText(serverDefault.toString());
		}
		
		
		setCells(
				cell("Server", serverTextField)
		);
	}
	
	@Override
	protected void onSave() {
		getNavigationController().popViewController(true);
	}

	
}
