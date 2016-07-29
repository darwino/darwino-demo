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

package com.darwino.demo.dominodisc.watson;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.commons.tasks.Task;
import com.darwino.commons.tasks.TaskException;
import com.darwino.commons.tasks.TaskExecutorContext;

/**
 * Darwino task to execute a Document Processor on a scheduled basis.
 */
public class BatchDocumentProcessorTask extends Task<Void> {
		
	private BatchDocumentProcessor processor;
	
	public BatchDocumentProcessorTask(BatchDocumentProcessor processor) {
		this.processor = processor;
	}
	
	public BatchDocumentProcessor getDocumentProcessor() {
		return processor;
	}
	
	@Override
	public Void execute(TaskExecutorContext context) throws TaskException {
		try {
			getDocumentProcessor().execute();
		} catch(JsonException e) {
			Platform.log(e);
			throw new TaskException(e);
		}
		return null;
	}
}
