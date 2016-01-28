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

var services = angular.module('wReader.services', ['ngSanitize']);

var jstore = darwino.jstore;
var jstore_baseUrl = "$darwino-jstore";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();

function Item(entry, feed_link) {
  this.read = false;
  this.selected = false;

  // parse the entry from JSON
  if (entry) {
	  this.title = entry.value.title;
	  this.read =  entry.read;
	  this.item_id = entry.unid;
	  this.unid = entry.unid;
	  this.pub_author = entry.value.source;
  	  this.pub_date = Date.parse(entry.value.mdate);
	  this.image = jstore_baseUrl+'/databases/news/stores/news/documents/'+entry.unid+"/attachments/thumbnail.png";
//	  this.item_link = getLink(entry.link, 'alternate');
//	  this.feed_link = feed_link;
  }
}

Item.prototype.load = function(http,unid,cb) {
	if(!this.content && unid) {
	    var url = jstore_baseUrl+'/databases/news/stores/news/documents/'+unid;
		var _this = this;
	    var successCallback = function(data, status, headers, config) {
	    	_this.content = data.json.content;
	    	if(cb) cb(_this);
		};
	    http.get(url).success(successCallback);
	} else {
    	if(cb) cb(this);
	}
};


services.factory('items', ['$http', 'filterFilter', function($http, filter) {
	var items = {
		all: [],
		selected: null,
		selectedIdx: null,
		ftSearch: null,
		category: null,

		getItemsFromServer: function() {
			this.loadItems(0,30);
		},
		loadMore: function() {
			this.loadItems(this.all.length,10);
		},
		loadItems: function(skip,limit) {
			var idxName = this.category ? "byCategory" : "byDate";
			var feedURL = jstore_baseUrl+'/databases/news/stores/news/indexes/'+idxName+'/entries'
					+'?skip='+skip
					+'&limit='+limit
					+'&options='+jstore.Cursor.DATA_READMARK;
			if(this.ftSearch) {
				feedURL += "&ftsearch="+encodeURIComponent(this.ftSearch);
			}
			if(this.category) {
				feedURL += "&key="+encodeURIComponent(this.category);
			}
			function absoluteURL(url) {
				var a = document.createElement('a');
				a.href = url;
				return a.href;
			}
			feedURL = absoluteURL(feedURL); 
			var successCallback = function(data, status, headers, config) {
				if(skip==0) {
					items.all = [];
				}
				// Iterate through the items and create a new JSON object for each item
				for(var i=0; i<data.length; i++) {
					var entry = data[i]; 
					var item = new Item(entry, null);
					items.all.push(item);
				}
				console.log('Entries loaded from server: '+feedURL+', #', items.all.length);
			};
			$http.get(feedURL).success(successCallback);
		},
		prev: function() {
			if (items.hasPrev()) {
				items.selectItem(items.selected ? items.selectedIdx - 1 : 0);
			}
		},
		next: function() {
			if (items.hasNext()) {
				items.selectItem(items.selected ? items.selectedIdx + 1 : 0);
			}
		},
		hasPrev: function() {
			if (!items.selected) {
				return true;
			}
			return items.selectedIdx > 0;
		},
		hasNext: function() {
			if (!items.selected) {
				return true;
			}
			return items.selectedIdx < items.all.length - 1;
		},
		selectItem: function(idx) {
			var sel = items.all[idx];
			if(sel) {
		    	sel.load($http,sel.unid,function(item) {
		    	    // Unselect previous selection.
		    	    if (items.selected) {
		    	      items.selected.selected = false;
		    	    }
	
		        	items.selected = items.all[idx];
		        	items.selectedIdx = idx;
		        	items.selected.selected = true;
	
		    	    items.toggleRead(true);
		    	});
			}
		},
		toggleRead: function(opt_read) {
			var item = items.selected;
			item.read = opt_read;
		},
		markAllRead: function() {
			items.all.forEach(function(item) {
				item.read = true;
			});
		},
		clearFilter: function() {
		},
		allCount: function() {
			return items.all.length;
		},
		readCount: function() {
			return items.all.filter(function(val, i) { return val.read }).length;
		},
		unreadCount: function() {
			return items.all.length - items.readCount();
		}
	};

	items.getItemsFromServer();
	return items;
}]);


services.value('scroll', {
	pageDown: function() {
		var itemHeight = $('.entry.active').height() + 60;
		var winHeight = $(window).height();
		var curScroll = $('.entries').scrollTop();
		var scroll = curScroll + winHeight;

		if (scroll < itemHeight) {
			$('.entries').scrollTop(scroll);
			return true;
		}

		// already at the bottom
		return false;
	},

	toCurrent: function() {
		// Need the setTimeout to prevent race condition with item being selected.
		window.setTimeout(function() {
			var curScrollPos = $('.summaries').scrollTop();
			var itemTop = $('.summary.active').offset().top - 60;
			$('.summaries').animate({'scrollTop': curScrollPos + itemTop}, 200);
		}, 0);
	}
});
