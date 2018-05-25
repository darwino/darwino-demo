/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.darwino.demo.dominodisc.app;

import java.io.InputStream;

import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Display;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.util.io.StreamUtil;
import com.darwino.swt.platform.hybrid.SwtMain;

/**
 * SWT Application
 */
public class SwtMainClass extends SwtMain {

	@Override
	public String getApplicationId() {
		return "com.darwino.dominodisc";
	}
	
	@Override
	public final void onCreate() {
		super.onCreate();

		// Create the Darwino Application
		try {
			AppHybridApplication.create(this);
		} catch(JsonException ex) {
			throw new RuntimeException("Unable to create Darwino application", ex);
		}
	}
	
	@Override
	public Image[] getIcons() {
		Display display = Display.getDefault();
		
		String[] iconNames = { "/icon/Icon-72.png", "/icon/Icon-72@2x.png" }; //$NON-NLS-1$ //$NON-NLS-2$
		Image[] result = new Image[iconNames.length];
		for(int i = 0; i < iconNames.length; i++) {
			@SuppressWarnings("resource")
			InputStream is = SwtMainClass.class.getResourceAsStream(iconNames[i]);
			Image icon = new Image(display, is);
			StreamUtil.close(is);
			result[i] = icon;
		}
		
		return result;
	}
	
	public static void main(String[] args) {
		SwtMainClass main = new SwtMainClass();
		main.execute();
	}
}
