/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc 2014-2015.
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has been
 * deposited with the U.S. Copyright Office.     
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
