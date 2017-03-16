/*!COPYRIGHT HEADER! 
 *
 */

package com.darwino.demo.react.app;

import java.util.List;

import com.darwino.mobile.platform.commands.CommandsExtension;



/**
 * SWT Plugin for registering the services.
 * 
 */
public class AppPlugin extends AppMobilePlugin {
	
	public AppPlugin() {
		super("SWT Application");
	}

	@Override
	public void findExtensions(Class<?> serviceClass, List<Object> extensions) {
		if(serviceClass==CommandsExtension.class) {
			extensions.add(new AppHybridActions());
		}
	}
}
