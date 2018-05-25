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

package com.darwino.demo.news.moe;

import com.darwino.application.jsonstore.NewsManifest;
import com.darwino.commons.json.JsonException;
import com.darwino.demo.platforms.DemoMobileManifest;
import com.darwino.ios.platform.anative.DarwinoIOSNativeApplication;
import com.darwino.mobile.platform.DarwinoMobileApplication;
import com.darwino.platform.DarwinoManifest;

public class NewsMOENativeApplication extends DarwinoIOSNativeApplication {
	
	public static NewsMOENativeApplication create() throws JsonException {
		if(!DarwinoMobileApplication.isInitialized()) {
			NewsMOENativeApplication app = new NewsMOENativeApplication(
					new NewsManifest(new DemoMobileManifest(NewsManifest.MOBILE_PATHINFO)));
			app.init();
		}
		return (NewsMOENativeApplication)DarwinoMobileApplication.get();
	}
	
	public NewsMOENativeApplication(DarwinoManifest manifest) {
		super(manifest);
	}
}
