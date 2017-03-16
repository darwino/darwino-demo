/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.react.app;

import android.os.Bundle;

import com.darwino.android.platform.hybrid.DarwinoHybridActivity;

public class MainActivity extends DarwinoHybridActivity {
	
	public MainActivity() {
	}
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        loadMainPage();
	}
}
