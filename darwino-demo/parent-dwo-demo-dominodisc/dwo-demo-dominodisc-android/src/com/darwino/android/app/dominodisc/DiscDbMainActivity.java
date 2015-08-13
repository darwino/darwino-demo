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

package com.darwino.android.app.dominodisc;

import android.os.Bundle;

//import com.darwino.android.platform.hybrid.DarwinoCordovaHybridActivity;
import com.darwino.android.platform.hybrid.DarwinoHybridActivity;

//public class DiscDbMainActivity extends DarwinoCordovaHybridActivity {
public class DiscDbMainActivity extends DarwinoHybridActivity {
	
	public DiscDbMainActivity() {
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        loadMainPage();
	}
}
