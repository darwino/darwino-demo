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

package com.darwino.android;

import com.darwino.android.DarwinoSettingsActivity;
import com.darwino.android.platform.anative.DarwinoAndroidNativeActions;
import com.darwino.mobile.platform.DarwinoActions;

/**
 * 
 */
public class DarwinoNativeSettingsActivity extends DarwinoSettingsActivity {

	@Override
	public DarwinoActions getDarwinoTasks() {
		return new DarwinoAndroidNativeActions(this);
	}
}
