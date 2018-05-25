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

var jsonExplorer = angular.module('jsonExplorer', [ 
	'ngTouch', 'darwino', 
	'ui.bootstrap','ui.codemirror',
	'jsonExplorer.services'
])

.controller('AppController', ['$scope','$http', function($scope,$http) {
	var Node = Class.extend({
		init: function(label,tmpl) {
			this.label = label;
			this.tmpl = tmpl;
			this.expanded = false;
			this.children = [];
		},
		load: function() {
			// empty by default
		},
		getInstanceId: function() {
			return null;
		},
		keyDb: function(db) {
			return db.getId()+';'+db.getInstance().getId();
		},
		keyStore: function(store) {
			return this.keyDb(store.getDatabase())+';'+store.getId();
		},
		keyIndex: function(index) {
			return this.keyStore(index.getStore())+';'+index.getId();
		},
		keyDoc: function(doc) {
			return this.keyStore(doc.getStore())+';'+doc.getDocId();
		}
	});
	var LoadingNode = Node.extend({
		id: null,
		init: function() {
			this._super("Loading...");
			this.iconClass = "glyphicon glyphicon-refresh glyphicon-spin";
		}
	});
	var DatabaseNode = Node.extend({
		id: null,
		def: null,
		init: function(db) {
			var label = db.getLabel();
			var instId = db.getInstance().getId();
			if(instId) {
				label += " ["+instId+"]";
			}
			this._super(label,"templates/database.html");
			this.key = this.keyDb(db);
			this.db = db;
			this.id = this.db.getId();
			this.def = darwino.Utils.toJson(this.db.getJsonMetadata());
			this.iconClass = "glyphicon glyphicon-hdd";
		},
		getDatabase: function() {
			return this.db;
		},
		getInstanceId: function() {
			return this.getDatabase().getInstance().getId();
		}
	});
	var CursorNode = Node.extend({
		rows:		null,
		rowCount:	0,
		page:		0,
		pageSize:	10,
		numPages:	5,
		init: function(label,tmpl) {
			this._super(label,tmpl);
			this.iconClass = "glyphicon glyphicon-briefcase";
		},
		load: function() {
			var _this = this;
			_this.rows = [];

			var inst = this.getInstanceId();
			
			// Row count
			var url = this.getUrl()+"/count";
			if(inst) {
				url += "?instance="+encodeURIComponent(inst);
			}
			$http.get(url).success(function(data) {
				_this.rowCount = data.count;
			});
			
			// Entries
			var url = this.getUrl()+"/entries";
			var options = darwino.jstore.Cursor.DATA_MODDATES;
			url += "?options="+options;
			if(inst) {
				url += "&instance="+encodeURIComponent(inst);
			}
			url += "&skip="+this.page*this.pageSize;
			url += "&limit="+this.pageSize;
			$http.get(url).success(function(data) {
				_this.rows = data;
			});
		},
		openDocument: function(row) {
			$scope.openDocument(this.getStore(),row.id);
		},
		getDatabase: function() {
			return this.store.getDatabase();
		},
		getInstanceId: function() {
			return this.getDatabase().getInstance().getId();
		}
	});
	var StoreNode = CursorNode.extend({
		rows:	null,
		skip:	0,
		limit:	10,
		init: function(store) {
			this._super(store.getLabel(),"templates/store.html");
			this.key = this.keyStore(store);
			this.store = store;
		},
		getUrl: function() {
			return '$darwino-jstore/databases/'+this.getDatabase().getId()+'/stores/'+this.getStore().getId();
		},
		getDatabase: function() {
			return this.getStore().getDatabase();
		},
		getStore: function() {
			return this.store;
		}
	});
	var IndexNode = Node.extend({
		init: function(index) {
			this._super(index.getLabel(),"templates/index.html");
			this.key = this.keyIndex(index);
			this.index = index;
		},
		getUrl: function() {
			return '$darwino-jstore/databases/'+this.getDatabase().getId()+'/stores/'+this.getStore().getId()+"/indexes/"+this.getIndex().getId();
		},
		getDatabase: function() {
			return this.getStore().getDatabase();
		},
		getStore: function() {
			return this.getIndex().getStore();
		},
		getIndex: function() {
			return this.index;
		}
	});
	var DocumentNode = Node.extend({
		init: function(doc) {
			this._super(doc.getDocId(),"templates/document.html");
			this.key = this.keyDoc(doc);
			this.doc = doc;
			this.meta = doc.asJson(jstore.Document.JSON_METADATA|jstore.Document.JSON_ALLATTACHMENTS|jstore.Document.JSON_ATTACHMENTURL); // No JSON doc
			this.json = doc.getJsonString(false);
			this.iconClass = "glyphicon glyphicon-file";
		},
		getInstanceId: function() {
			return this.doc.getDatabase().getInstance().getId();
		}
	});

	$scope.hybrid = darwino.hybrid.isHybrid();

	$scope.treeopt = {
		nodeChildren : "children",
		dirSelectable : true
	};
	
	$scope.pages = [];

	$scope.nodeSelected = function(sel) {
		if(sel) {
			this.addPage(sel);
		}
	}

	$scope.openDocument = function(store,docId) {
		var key = "dc:"+store.getDatabase().getId()+";"+store.getId()+";"+docId;
		var node = this.findPage(key);
		if(!node) {
			var doc = store.getDatabase().loadDocumentById(docId);
			node = new DocumentNode(doc);
			this.pages.push(node);
		}
		node.active = true;
	}
	
	$scope.addPage = function(node) {
		var p = this.findPage(node.key);
		if(!p) {
			this.pages.push(node);
			node.load();
		}
		node.active = true;
	}
	$scope.closePage = function(index) {
		this.pages.splice(index,1)
	}
	$scope.findPage = function(key) {
		for(var i=0; i<this.pages.length; i++) {
			if(this.pages[i].key==key) {
				return this.pages[i];
			}
		}
		return null;
	}

	$scope.treedata = [
	    new LoadingNode()
	];
	session.getDatabaseList(function(databases) {

		var na = $scope.treedata = [];
		
		databases.sort();
		var dbSuffix = 1;
		for(var i=0; i<databases.length; i++) {
			loadInstances(databases[i])
		}

		// Apply in case there is no databases
		$scope.$apply(); // Refresh the tree
		
		function loadInstances(database) {
			
			session.getDatabaseInstances(database,function(inst) {
				if(!inst || inst.length==0) {
					inst = [""];
				}
				for(var i=0; i<inst.length; i++) {
					loadDatabase(inst[i]);
				}
			});
			
			function loadDatabase(instance) {
				session.getDatabase(database,instance,function(db) {
					var db = session.getDatabase(database,instance);
					var nd = new DatabaseNode(db);
				
					var stores = db.getStoreList().sort();
					var stSuffix = 1;
					for(var j=0; j<stores.length; j++) {
						var st = db.getStore(stores[j]);
					
						var ns = new StoreNode(st);
						nd.children.push(ns);

						var indexes = st.getIndexList();
						var ixSuffix = 1;
						for(var k=0; k<indexes.length; k++) {
							var ix = st.getIndex(indexes[k]);

							var ni = new IndexNode(ix);
							ns.children.push(ni);
						}
					}
					
					na.push(nd);
					$scope.$apply(); // Refresh the tree
				});
			}
		}
	});	
}])

.filter('formattedDate', function() {
	return function(d) {
		if(darwino.Utils.isNumber(d)) {
			d = new Date(d);
		}
		return d ? moment(d).format('YYYY-MM-DD HH:mm:ss') : '';
	}
})
