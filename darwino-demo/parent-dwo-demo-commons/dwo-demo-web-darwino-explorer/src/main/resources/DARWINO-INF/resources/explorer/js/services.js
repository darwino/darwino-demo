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

var services = angular.module('jsonExplorer.services', ['ngSanitize']);

var jstore = darwino.jstore;
var jstore_baseUrl = "$darwino-jstore";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();
session.setAsync(false);

services.factory('expdata', [function() {
	var expdata = {
		pages:	[],
		findPage: function(id) {
			for(var i=0; i<this.pages.length; i++) {
				if(this.pages[i].id==id) {
					return i;
				}
			}
			return -1;
		},
		addDatabasePage: function(dbName) {
			var db = session.getDatabase(dbName);
			var id = "database:"+dbName;
			if(this.findPage(id)<0) {
				var p = {
					type:	0,
					id:		id,
					db:		db,
					def: 	darwino.Utils.toJson(db.getJsonMetadata())
				};
				pages.push(p);
			}
		},
		addCollectionPage: function(dbName,storeName,indexName) {
			var store = session.getDatabase(dbName).getStore(storeName);
			var index = indexName ? store.getIndex(indexName) : null; 
			var id = "store:"+dbName+";"+storeName+(indexName?";"+indexName:"");
			if(this.findPage(id)<0) {
				var url = jstore_baseUrl+'/ui/grid/databases/'+ dbName+'/stores/'+storeName+(indexName?'/indexes/'+indexName:'')+'/entries/uigrid';
				var p = {
					type:	1,
					id:		id,
					store:	store,
					index:	index,
					url:	url
				};
				pages.push(p);
			}
		},
		addDocumentPage: function(dbName,storeName,docId) {
			var doc = session.getDatabase(dbName).getStore(storeName).loadDocument(docId);
			var id = "doc:"+dbName+";"+storeName+";"+docId;
			if(this.findPage(id)<0) {
				var p = {
					type:	0,
					id:		id,
					doc:	doc
				};
				pages.push(p);
			}
		}
	};
	return expdata;
}]);
