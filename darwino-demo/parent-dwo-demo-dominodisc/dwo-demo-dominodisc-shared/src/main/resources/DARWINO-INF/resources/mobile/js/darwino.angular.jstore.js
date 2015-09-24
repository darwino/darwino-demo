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

	var REFRESHCOUNT = 15;
	var MORECOUNT = 10;

	var ngHttp;
	var ngTimeout;
	
	var jstore = darwino.jstore;
	
	function ItemList(session,databaseId,storeId,instanceId) {
		//darwino.log.d(LOG_GROUP,"Create ItemList for database {0}, store {1}",databaseId,storeId);
		this.session = session;
		this.baseUrl = session.getHttpStoreClient().getHttpClient().getBaseUrl();
		this.databaseId = databaseId;
		this.storeId = storeId;
		this.instanceId = instanceId;
		this.state = 0;
		this.all = [];
		this.count = -2;
		this.eof = false;
		this.selectedItem = null;
		this.detailItem = null;
		this.detailDocument = null;
		this.ftSearch = "";
		this.showResponses = {};
		this.refreshCount = REFRESHCOUNT;
		this.moreCount = MORECOUNT;

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

	ItemList.prototype.getInstance = function() {
		return this.instanceId;
	}
	ItemList.prototype.setInstance = function(id,cb) {
		this.instanceId = id;
		this.refresh(0,cb);
	}
	
	ItemList.prototype._databaseUrl = function() {
		return darwino.Utils.concatPath(this.baseUrl,"/databases/")+encodeURIComponent(this.databaseId);
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
		// Performance on larger dataset
		// A count can be very time consuming, so we disable it
		// -> https://wiki.postgresql.org/wiki/FAQ#Why_is_.22SELECT_count.28.2A.29_FROM_bigtable.3B.22_slow.3F
		// We postpone the count to a bit later, so the data query is executed before...
		var _this = this;
		if(this.count<-1) {
			this.count = -1;
			var url = this._storeUrl()+"/count";
			var options = jstore.Cursor.RANGE_ROOT;
			url += "?options="+options;
			if(this.ftSearch) {
				url += "&ftsearch="+encodeURIComponent(this.ftSearch);
			}
			if(this.instanceId) {
				url += '&instance=' + encodeURIComponent(this.instanceId);
			}
			setTimeout(function() {
				ngHttp.get(url).success(function(data) {
					_this.count = data['count'];
					darwino.log.d(LOG_GROUP,"Calculated store entries count {0}",_this.count);
				})
			},
			200);
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
		var _this = this;
		function doRefresh() {
			_this.refreshTimeout = null;
			_this.eof = false;
			_this.all = [];
			_this.selectedItem = null;
			_this.detailItem = null;
			_this.count = -2;
			_this.showResponses = {};
			_this.loadItems(0,_this.refreshCount,cb);
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
	ItemList.prototype.isShowResponses = function(item) {
		return this.showResponses[item.unid]==true;
	}
	ItemList.prototype.toggleResponses = function(item) {
		this.showResponses[item.unid] = !this.showResponses[item.unid];
	}
	
	ItemList.prototype.hasMore = function() {
		// We cannot check the loading flag here as it changes the state and forces a loadMore()
		// So we check it in loadMore(), where we do nothing
		return !this.eof;
	}
	
	ItemList.prototype.loadMore = function(cb) {
		// If there is already an ongoing request, then ignore the new one
		// We call the callback anyway to broadcast what should be broadcasted...
		if(!this.hasMore() || this.loading) {
			if(cb) cb();
			return;
		}
		darwino.log.d(LOG_GROUP,"Load more entries, count={0}",this.all.length);
		this.loading = true;
		this.loadItems(this.all.length,this.moreCount,cb);
	}
	
	ItemList.prototype.loadItems = function(skip,count,cb) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?skip='+skip
				+'&limit='+count
				+'&hierarchical=99'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		if(this.ftSearch) {
			url += "&ftsearch="+encodeURIComponent(this.ftSearch);
			//url += '&orderby=_ftRank'
		} else {
			url += '&orderby=_cdate desc'
		}
		if(this.instanceId) {
			url += '&instance=' + encodeURIComponent(this.instanceId);
		}
		this._loadItems(url,function(data) {
			if(data.length<count) {
				_this.eof = true;
			}
			if(data.length>0) {
				for(var i=0; i<data.length; i++) {
					_this.all.push(data[i]);
				}
				if(!_this.selectedItem && _this.all.length) {
					_this.selectItem(_this.all[0]);
				}
			}
			
			// Convert attachment URLs to display format
			for(var i = 0; i < data.length; i++) {
				for(var field in data[i].value) {
					if(darwino.Utils.isString(data[i].value[field])) {
						data[i].value[field] = darwino.jstore.richTextToDisplayFormat(_this.databaseId, data[i].storeId, _this.instanceId, data[i].unid, data[i].value[field]);
					}
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
		if(this.instanceId) {
			url += '&instance=' + encodeURIComponent(this.instanceId);
		}
		this._loadItems(url,function(data) {
			if(data.length>0) {
				var entry = data[0]
				
				// Convert attachment URLs to display format
				for(var field in entry.value) {
					if(darwino.Utils.isString(entry.value[field])) {
						entry.value[field] = darwino.jstore.richTextToDisplayFormat(_this.databaseId, entry.storeId, _this.instanceId, entry.unid, entry.value[field]);
					}
				}
				
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
		if(this.instanceId) {
			url += '&instance=' + encodeURIComponent(this.instanceId);
		}
		this._loadItems(url,function(data) {
			if(data.length>0) {
				var entry = data[0]
				
				// Convert attachment URLs to display format
				for(var field in entry.value) {
					if(darwino.Utils.isString(entry.value[field])) {
						entry.value[field] = darwino.jstore.richTextToDisplayFormat(_this.databaseId, entry.storeId, _this.instanceId, entry.unid, entry.value[field]);
					}
				}
				
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
		var _this = this;
		if(!item) return null;
		if(!item.attachments) {
			item.attachments = [];
			var jsonfields = jstore.Document.JSON_ALLATTACHMENTS;
			var options = jstore.Store.DOCUMENT_NOREADMARK;
			var url = this._storeUrl()+"/documents/"+encodeURIComponent(item.unid)+"?jsonfields="+jsonfields+"&options="+options;
			if(this.instanceId) {
				url += '&instance=' + encodeURIComponent(this.instanceId);
			}
			ngHttp.get(url).success(function(data) {
				var atts = data.attachments;
				if(atts) {
					// Do some post-processing
					angular.forEach(atts, function(att) {
						var display = att.name;
						var delimIndex = display.indexOf("||");
						
						// If it's an inline image, ignore it entirely
						if(delimIndex > -1) {
							return;
						}
						
						// Otherwise, remove any field-name prefix
						delimIndex = display.indexOf("^^");
						if(delimIndex > -1) {
							display = display.substring(delimIndex+2);
						}
						
						item.attachments.push({
							name: att.name,
							display: display,
							length: att.length,
							mimeType: att.mimeType,
							url: session.getUrlBuilder().getAttachmentUrl(_this.databaseId, _this.storeId, data.unid, att.name)
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
