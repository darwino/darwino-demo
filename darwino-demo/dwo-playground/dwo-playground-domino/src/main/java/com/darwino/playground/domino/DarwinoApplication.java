/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
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

package com.darwino.playground.domino;

import javax.servlet.ServletContext;

import org.osgi.framework.Bundle;

import com.darwino.commons.json.JsonException;
import com.darwino.commons.platform.ManagedBeansService;
import com.darwino.domino.application.DarwinoDominoApplication;
import com.darwino.platform.DarwinoManifest;
import com.darwino.playground.app.AppManifest;


/**
 * Domino application.
 * 
 * @author Philippe Riand
 */
public class DarwinoApplication extends DarwinoDominoApplication {
	
	public static DarwinoDominoApplication create(ServletContext context) throws JsonException {
		if(!DarwinoDominoApplication.isInitialized()) {
			DarwinoApplication app = new DarwinoApplication(
					context,
					new AppManifest(new AppDominoManifest())
			);
			app.init();
		}
		return DarwinoDominoApplication.get();
	}
	
	protected DarwinoApplication(ServletContext context, DarwinoManifest manifest) {
		super(context,manifest);
	}

	@Override
	public Bundle getBundle() {
		return Activator.getDefault().getBundle();
	}

	@Override
	public String[] getResourcesBundleNames() {
		return new String[] {
			"com.darwino.playground.domino", //$NON-NLS-1$
			"com.darwino.playground.webui", //$NON-NLS-1$
			"com.darwino.domino.libs", //$NON-NLS-1$
			"com.darwino.demo.web.darwino", //$NON-NLS-1$
			"com.darwino.demo.web.darwino.explorer" //$NON-NLS-1$
		};
	}
	
	@Override
	public String[] getConfigurationBeanNames() {
		return new String[] {"Playground",ManagedBeansService.LOCAL_NAME,ManagedBeansService.DEFAULT_NAME}; //$NON-NLS-1$
	}
}
