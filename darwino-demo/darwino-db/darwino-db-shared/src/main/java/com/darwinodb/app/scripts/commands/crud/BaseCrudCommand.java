/*!COPYRIGHT HEADER! 
 *
 */

package com.darwinodb.app.scripts.commands.crud;

import com.darwino.jsonstore.Database;
import com.darwino.jsonstore.Store;
import com.darwinodb.app.scripts.commands.AbstractCommand;

public abstract class BaseCrudCommand extends AbstractCommand {

	public BaseCrudCommand() {
	}
	
	public abstract Database getDatabase();
	public abstract Store getStore();
}
