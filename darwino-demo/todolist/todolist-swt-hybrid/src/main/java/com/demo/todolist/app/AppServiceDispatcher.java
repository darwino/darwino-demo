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

package com.demo.todolist.app;


import com.darwino.commons.services.HttpServerContext;
import com.darwino.commons.services.HttpServiceFactories;
import com.darwino.mobile.hybrid.platform.NanoHttpdDarwinoHttpServer;
import com.darwino.mobile.hybrid.services.MobileDelegateRestFactory;


public class AppServiceDispatcher extends NanoHttpdDarwinoHttpServer {
	
	public AppServiceDispatcher(HttpServerContext context) {
		super(context);
	}
	
	@Override
	public void addApplicationServiceFactories(HttpServiceFactories factories) {
		// The service should be executed locally or remotely (proxy), depending on the current mode
		factories.add(new MobileDelegateRestFactory(new AppServiceFactory()));
	}
}
