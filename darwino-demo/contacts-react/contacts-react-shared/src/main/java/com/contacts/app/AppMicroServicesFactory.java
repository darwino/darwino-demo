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

package com.contacts.app;

import com.darwino.commons.microservices.StaticJsonMicroServicesFactory;

import com.contacts.app.microservices.HelloWorld;
import com.contacts.app.microservices.RollbarConfig;
import com.contacts.app.microservices.ServerError;
import com.contacts.app.microservices.SetCompanySize;
import com.contacts.app.microservices.SetSessionLocale;


/**
 * Application Micro Services Factory.
 * 
 * This is the place where to define custom application micro services.
 * 
 * @author Philippe Riand
 */
public class AppMicroServicesFactory extends StaticJsonMicroServicesFactory {
	
	public AppMicroServicesFactory() {
		add(HelloWorld.NAME, new HelloWorld());
		add(SetCompanySize.NAME, new SetCompanySize());
		add(SetSessionLocale.NAME, new SetSessionLocale());
		add(ServerError.NAME, new ServerError());
		add(RollbarConfig.NAME, new RollbarConfig());
	}
}
