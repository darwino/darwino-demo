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

darwino.provide("darwino/angular/jstore",null,function() {

	var LOG_GROUP = "darwino.angular.jstore";
	darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)
	
	var mod = angular.module('darwino.angular.jstore',[]);

	var ITEMCOUNT = 10;

	var ngHttp;
	var ngTimeout;
	
	function ItemList(session,databaseId,storeId) {
		darwino.log.d(LOG_GROUP,"Create ItemList for database {0}, store {1}",databaseId,storeId);
		this.session = session;
		this.baseUrl = session.getHttpStoreClient().getHttpClient().getBaseUrl();
		this.databaseId = databaseId;
		this.storeId = storeId;
		this.all = [];
		this.count = -2;
		this.eof = false;
		this.selectedItem = null;
		this.detailItem = null;
		this.detailDocument = null;
		this.ftSearch = "";
		this.showResponses = {};
		this.itemCount = ITEMCOUNT;

		this.refreshTimeout = null;
		this.loading = false;
	}
	
	ItemList.prototype.getDatabase = function() {
		if(!this.database) {
			this.database = session.getDatabase(this.databaseId);
		}
		return this.database;
	}
	ItemList.prototype.getStore = function() {
		if(!this.store) {
			this.store = this.getDatabase().getStore(this.storeId);
		}
		return this.store;
	}
	
	ItemList.prototype._databaseUrl = function() {
		return this.baseUrl+"/databases/"+encodeURIComponent(this.databaseId);
	}
	ItemList.prototype._storeUrl = function(u) {
		return this._databaseUrl()+"/stores/"+encodeURIComponent(this.storeId);
	}
	
	ItemList.prototype.findRoot = function(unid) {
		if(unid) {
			for(var i=0; i<this.all.length; i++) {
				if(this.all[i].unid==unid) {
					return this.all[i];
				}
				if(this._hasItem(this.all[i],unid)) {
					return this.all[i];
				}
			}
		}
		return null;
	}
	ItemList.prototype._hasItem = function(root,unid) {
		if(root.children) {
			for(var i=0; i<root.children.length; i++) {
				if(root.children[i].unid==unid) {
					return true;
				}
				if(this._hasItem(root.children[i],unid)) {
					return true;
				}
			}
		}
		return false;
	}
	ItemList.prototype.getEntriesCount = function() {
		var _this = this;
		if(this.count<-1) {
			this.count = -1;
			if(this.ftSearch) {
				var url = this._storeUrl()+"/count?ftsearch="+encodeURIComponent(this.ftSearch)+'&hierarchical=1';
			} else {
				var url = this._storeUrl()+"/count?hierarchical=1";
			}
			ngHttp.get(url).success(function(data) {
				_this.count = data['count'];
				darwino.log.d(LOG_GROUP,"Calculated store entries count {0}",_this.count);
			});
		}
		return this.count>=0 ? this.count : null; 
	}
	ItemList.prototype.selectItem = function(selectedItem) {
		this.detailItem = selectedItem;
		this.detailDocument = null;
		if(!selectedItem.parentUnid) {
			this.selectedItem = selectedItem;
		}	
	}

	ItemList.prototype.refresh = function(delay,cb) {
		console.log("Calling refresh");
		var _this = this;
		function doRefresh() {
			_this.refreshTimeout = null;
			_this.eof = false;
			_this.all = [];
			_this.selectedItem = null;
			_this.detailItem = null;
			_this.count = -2;
			_this.showComments = {};
			_this.loadItems(0,cb);
		}
		if(_this.refreshTimeout) {
			ngTimeout.cancel(_this.refreshTimeout);
			_this.refreshTimeout = null;
		}
		_this.loading = true;
		if(delay) {
			_this.refreshTimeout = ngTimeout(doRefresh,delay);
		} else {
			doRefresh();
		}
	}
	ItemList.prototype.toggleResponses = function(item) {
		this.showResponses[item.unid] = !this.showComments[item.unid];
	}
	
	ItemList.prototype.hasMore = function() {
		// We cannot check the loading flag here as it changes the state and forces a loadMore()
		// So we check it in loadMore(), where we do nothing
		return !this.eof;
	}
	
	ItemList.prototype.loadMore = function(cb) {
		console.log("Calling loadmore");
		// If there is already an ongoing request, then ignore the new one
		// We call the callback anyway to broadcast what should be broadcasted...
		if(!this.hasMore() || this.loading) {
			if(cb) ngTimeout(cb());
			return;
		}
		darwino.log.d(LOG_GROUP,"Load more entries, count={0}",this.all.length);
		this.loading = true;
		this.loadItems(this.all.length,cb);
	}
	
	ItemList.prototype.loadItems = function(skip,cb) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?skip='+skip
				+'&limit='+this.itemCount
				+'&hierarchical=99'
				+(this.ftSearch?"&ftsearch="+encodeURIComponent(this.ftSearch):"")
				+'&orderby=_cdate desc'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		this._loadItems(url,function(data) {
			if(data.length>0) {
				for(var i=0; i<data.length; i++) {
					_this.all.push(data[i]);
				}
				if(data.length<_this.itemCount) {
					_this.eof = true;
				}
				if(!_this.selectedItem && _this.all.length) {
					_this.selectItem(_this.all[0]);
				}
			}
			if(cb) cb(data);
		});
	}

	ItemList.prototype.loadOneItem = function(unid) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?unid='+unid
				+'&hierarchical=99'
				+'&orderby=_cdate desc'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		this._loadItems(url,function(entry) {
			if(data.length>0) {
				var entry = data[0]
				_this.all.unshift(entry);				
				_this.selectItem(entry);
			}
		});
	}
	
	ItemList.prototype.reloadItem = function(item) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?unid='+item.unid
				+'&hierarchical=99'
				+'&orderby=_cdate desc'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		this._loadItems(url,function(data) {
			if(data.length>0) {
				var entry = data[0]
				for(var i=0; i<_this.all.length; i++) {
					darwino.log.d(LOG_GROUP,"Check DiscDB entry="+_this.all[i].unid+", "+entry.unid);
					if(_this.all[i].unid==entry.unid) {
						_this.all[i] = entry;
						_this.selectItem(entry);
						break;
					}
				}
			}
		});
	}
	
	ItemList.prototype.removeItem = function(item) {
		this.getStore().deleteDocument(item.unid);
		var rootItem = this.findRoot(item.unid);
		if(rootItem && rootItem!=item) { 
			this.reloadItem(rootItem);
			this.detailItem = this.findRoot(item.parentUnid);
		} else {
			var idx = this.all.indexOf(item);
			if(idx>=0) {
				this.all.splice(idx,1);
				this.selectedItem = this.all.length ? this.all[Math.max(idx-1,0)] : null;
			}
		}
	}
	
	ItemList.prototype._loadItems = function(url,cb) {
		var _this = this;
		function absoluteURL(url) {
			var a = document.createElement('a');
			a.href = url;
			return a.href;
		}
		url = absoluteURL(url); 
		var successCallback = function(data, status, headers, config) {
			if(cb) {
				cb(data);
			}
			darwino.log.d(LOG_GROUP,'Entries loaded from server: '+url+', #', _this.all.length);
			_this.loading = false;
		};
		ngHttp.get(url).success(successCallback);
	}

	ItemList.prototype.getAttachments = function(item) {
		if(!item) return null;
		if(!item.attachments) {
			item.attachments = [];
			var jsonfields = jstore.Document.JSON_ALLATTACHMENTS;
			var options = jstore.Store.DOCUMENT_NOREADMARK;
			ngHttp.get(this._storeUrl()+"/documents/"+encodeURIComponent(item.unid)+"?jsonfields="+jsonfields+"&options="+options).success(function(data) {
				var atts = data.attachments;
				if(atts) {
					// Do some post-processing
					angular.forEach(atts, function(att) {
						var name = att.name;
						var delimIndex = name.indexOf("||");
						
						// If it's an inline image, ignore it entirely
						if(delimIndex > -1) {
							return;
						}
						
						// Otherwise, remove any field-name prefix
						delimIndex = name.indexOf("^^");
						if(delimIndex > -1) {
							name = name.substring(delimIndex+2);
						}
						
						item.attachments.push({
							name: name,
							length: att.length,
							mimeType: att.mimeType,
							url: session.getUrlBuilder().getAttachmentUrl($rootScope.database.getId(), $rootScope.nsfdata.getId(), data.unid, att.name)
						})
					});
				}
			});
		}
		return item.attachments;
	}

	mod.service('$jstore', function($http,$timeout) {
		ngHttp = $http;
		ngTimeout = $timeout;
		return {
			createItemList: function(session,databaseId,storeId) {
				return new ItemList(session,databaseId,storeId);
			}
		}
	});
});
