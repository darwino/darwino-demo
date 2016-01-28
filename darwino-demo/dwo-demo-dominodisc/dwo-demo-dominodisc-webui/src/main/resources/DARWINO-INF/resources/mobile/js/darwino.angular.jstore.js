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
		this.indexId = null;
		this.instanceId = instanceId;
		this.orderBy = null;
		this.state = 0;
		this.all = [];
		this.count = -1;
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
		var url = this._databaseUrl()+"/stores/"+encodeURIComponent(this.storeId);
		if(this.indexId) {
			url += "/indexes/"+encodeURIComponent(this.indexId);
		}
		return url;
	}

	ItemList.prototype.isLoading = function() {
		return this.loading;
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
				ngHttp.get(url).then(function(response) {
					_this.count = response.data['count'];
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
			// If there is already an ongoing request, then ignore the new one
			if(_this.loading) {
				return;
			}
			_this.refreshTimeout = null;
			_this.eof = false;
			_this.all = [];
			_this.selectedItem = null;
			_this.detailItem = null;
			_this.count = -2; // Ask for the count
			_this.showResponses = {};
			_this.loadItems(0,_this.refreshCount,cb);
		}
		if(_this.refreshTimeout) {
			ngTimeout.cancel(_this.refreshTimeout);
			_this.refreshTimeout = null;
		}
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
	
	ItemList.prototype.loadMore = function(cb,err) {
		// If there is already an ongoing request, then ignore the new one
		if(!this.hasMore() || this.loading) {
			return;
		}
		darwino.log.d(LOG_GROUP,"Load more entries, count={0}",this.all.length);
		this.loadItems(this.all.length,this.moreCount,cb,err);
	}
	
	ItemList.prototype.loadItems = function(skip,count,cb,err) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?skip='+skip
				+'&limit='+count
				+'&hierarchical=99'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		if(this.ftSearch) {
			url += "&ftsearch="+encodeURIComponent(this.ftSearch);
			url += '&orderby=_ftRank'
		} else if(this.orderBy) {
			url += '&orderby='+encodeURIComponent(this.orderBy);
		}
		if(this.instanceId) {
			url += '&instance=' + encodeURIComponent(this.instanceId);
		}
		
		this.loading = true;
		this._loadItems(url,function(data) {
			_this.loading = false;
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
			
			var rtToDisplay = function(doc) {
				for(var field in doc.value) {
					if(darwino.Utils.isString(doc.value[field])) {
						doc.value[field] = darwino.jstore.richTextToDisplayFormat(_this.databaseId, doc.storeId, _this.instanceId, doc.unid, doc.value[field]);
					}
				}
				
				if(doc.children) {
					for(var childIndex = 0; childIndex < doc.children.length; childIndex++) {
						rtToDisplay(doc.children[childIndex]);
					}
				}
			}
			
			
			// Convert attachment URLs to display format
			for(var i = 0; i < data.length; i++) {
				rtToDisplay(data[i]);
			}
			if(cb) cb(data);
		}, function(data) {
			// In case of error, all the items are considered loaded...
			_this.loading = false;
			_this.eof = true;
			if(err) err(data);
		});
	}

	ItemList.prototype.loadOneItem = function(unid) {
		var _this = this;
		var url = this._storeUrl()+'/entries'
				+'?unid='+unid
				+'&hierarchical=99'
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		if(this.orderBy) {
			url += '&orderby=' + encodeURIComponent(this.orderBy);
		}
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
				+'&jsontree=true'
				+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
		if(this.orderBy) {
			url += '&orderby=' + encodeURIComponent(this.orderBy);
		}
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
					darwino.log.d(LOG_GROUP,"Check DB entry="+_this.all[i].unid+", "+entry.unid);
					if(_this.all[i].unid==entry.unid) {
						_this.all[i] = entry;
						_this.selectItem(entry);
						break;
					}
				}
			}
		});
	}
	
	ItemList.prototype.deleteItem = function(item) {
		var _this = this;
		var url = this._storeUrl()+"/documents/"+encodeURIComponent(item.unid);
		if(this.instanceId) {
			url += '?instance=' + encodeURIComponent(this.instanceId);
		}
		ngHttp.delete(url).then(function(response) {
			var rootItem = _this.findRoot(item.unid);
			if(rootItem && rootItem!=item) { 
				_this.reloadItem(rootItem);
				_this.detailItem = _this.findRoot(item.parentUnid);
			} else {
				var idx = _this.all.indexOf(item);
				if(idx>=0) {
					_this.all.splice(idx,1);
					_this.selectedItem = _this.all.length ? _this.all[Math.max(idx-1,0)] : null;
				}
			}
		});
	}
	
	ItemList.prototype._loadItems = function(url,cb,cberr) {
		var _this = this;
		function absoluteURL(url) {
			var a = document.createElement('a');
			a.href = url;
			return a.href;
		}
		url = absoluteURL(url); 
		var successCallback = function(response) {
			if(cb) {
				cb(response.data);
			}
			darwino.log.d(LOG_GROUP,'Entries loaded from server: '+url+', #', _this.all.length);
		};
		var errorCallback = function(response) {
			if(cberr) {
				cberr();
			}
			darwino.log.d(LOG_GROUP,'Error while loading entries from server: '+url+', Err:'+response.status);
		};
		ngHttp.get(url).then(successCallback,errorCallback);
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
			ngHttp.get(url).then(function(response) {
				var atts = response.data.attachments;
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
							url: session.getUrlBuilder().getAttachmentUrl(_this.databaseId, _this.storeId, response.data.unid, att.name)
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
