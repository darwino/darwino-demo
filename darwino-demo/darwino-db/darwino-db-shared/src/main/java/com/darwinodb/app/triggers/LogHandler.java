/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.triggers;

import com.darwino.commons.Platform;
import com.darwino.commons.json.JsonException;
import com.darwino.jsonstore.Document;
import com.darwino.platform.events.jsonstore.JsonStoreChangesTrigger;

/**
 * Simple notification handler.
 */
public class LogHandler implements JsonStoreChangesTrigger.DocHandler {

	@Override
	public void handle(Document doc) throws JsonException {
		Platform.log("Handling document, store={0}, id={1}, document={2}",doc.getStore().getId(),doc.getUnid(),doc.getJsonString(true));
	}
}
