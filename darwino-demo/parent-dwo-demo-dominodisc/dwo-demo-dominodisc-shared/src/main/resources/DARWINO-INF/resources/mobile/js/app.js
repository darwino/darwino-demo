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

var jstore = darwino.jstore;
var services = darwino.services;

var jstore_baseUrl = "$darwino-jstore";
var social_baseUrl = "$darwino-social";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();
var userService = services.createUserService(social_baseUrl+"/users");

// Enable some logging
var LOG_GROUP = "discdb.web";
darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)

angular.module('discDb', [ 'ngSanitize','ionic', 'ngQuill' ])

.run(function($rootScope,$location,$state,$http,entries) {
	// Make some global var visible
	$rootScope.darwino = darwino;
	$rootScope.session = session;
	$rootScope.userService = userService;

	$rootScope.database = $rootScope.session.getDatabase("domdisc");
	$rootScope.nsfdata = $rootScope.database.getStore("nsfdata");

	$rootScope.entries = entries;
	
	$rootScope.isAnonymous = function() {
		return userService.getCurrentUser().isAnonymous();
	};
	$rootScope.isReadOnly = function() {
		return this.isAnonymous();
	};
	$rootScope.isFtEnabled = function() {
		return $rootScope.nsfdata.isFtSearchEnabled();
	};
	$rootScope.go = function(path) {
		$location.path(path);
	};
	$rootScope.apply = function() {
		setTimeout(function(){$rootScope.$apply()});
	};
	
	$rootScope.displayUser = function(dn) {
        $state.go('disc.user',{userdn:dn});
    }	
	
	$rootScope.isState = function(state) {
        return $state.is(state);
    }	
	
	darwino.hybrid.addSettingsListener(function(){
		$rootScope.apply();
	});
	
	
})

.filter('formattedDate', function() {
	return function(d) {
		return d ? moment(d).fromNow() : '';
	}
})

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('disc', {
		url : "/disc",
		abstract : true,
		templateUrl : "templates/discdb.html"
	}).state('disc.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "templates/home.html"
			}
		}
	}).state('disc.byDate', {
		url : "/bydate",
		views : {
			'menuContent' : {
				templateUrl : "templates/bydate.html",
				controller : "ByDateCtrl"
			}
		}
	}).state('disc.editpost', {
		url : "/editpost/:id",
		views : {
			'menuContent' : {
				templateUrl : "templates/editpost.html",
				controller : "EditCtrl"
			}
		}
	}).state('disc.user', {
		url : "/user/:userdn",
		views : {
			'menuContent' : {
				templateUrl : "templates/user.html",
				controller : "UserCtrl"
			}
		}
	});

	$urlRouterProvider.otherwise("/disc/bydate");
})

.controller('MainCtrl', function($scope) {
})

.service('entries', function($rootScope,$http) {
	var itemCount = 10; // Number of items requested by request
	var _this = {
		view: "byDate",
		
		all: [],
		count: -1,
		eof: false,
		selectedItem: null,
		detailItem: null,
		ftSearch: "",
		showComments: {},
		
		findRoot: function(unid) {
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
		},
		_hasItem: function(root,unid) {
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
		},

		getEntriesCount: function() {
			if(this.all.length==0) {
				return 0;
			}
			if(this.count<0) {
				this.count = 0;
				$http.get(jstore_baseUrl+"/databases/domdisc/stores/nsfdata/documentscount").success(function(data) {
					_this.count = data['count'];
					darwino.log.d(LOG_GROUP,"Calculated discussion entries count {0}",_this.count);
				});
			}
			return this.count; 
		},
		
		getUserDn: function(item) {
			return item ? item.value.from : null;
		},
		getUser: function(item) {
			return item ? userService.findUser(item.value.from,function(u,n){if(n){$rootScope.apply()}}) : darwino.services.User.ANONYMOUS_USER;
		},
		getPhoto: function(item) {
			return item ? userService.getUserPhotoUrl(item.value.from) : null;
		},
		selectItem: function(selectedItem) {
			this.detailItem = selectedItem;
			if(!selectedItem.parentUnid) {
				this.selectedItem = selectedItem;
			}	
		},
		refresh: function() {
			this.eof = false;
			this.all = [];
			this.selectedItem = null;
			this.detailItem = null;
			this.count = -1;
			this.showComments = {};
			this.loadItems(0,itemCount);
			darwino.hybrid.setDirty(false);
		},
		toggleComments: function(item) {
			this.showComments[item.unid] = !this.showComments[item.unid];
		},
		
		hasMore: function() {
			return !this.eof;
		},
		loadMore: function() {
			// Prevent a request if nothing has been loaded yet
			if(this.all.length==0) {
				return;
			}
			this.loadItems(this.all.length,itemCount);
		},
		
		loadItems: function(skip,limit) {
			// Prevents loop with infinite scroll
			if(this.eof) {
				$rootScope.$broadcast('scroll.infiniteScrollComplete');
				return;
			}
			var url = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?skip='+skip
					+'&limit='+limit
					+'&hierarchical=99'
					+(this.ftSearch?"&ftsearch="+encodeURIComponent(this.ftSearch):"")
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
			this._loadItems(url,limit,function(entry) {
				_this.all.push(entry);
			},function() {
				$rootScope.$broadcast('scroll.infiniteScrollComplete');
				$rootScope.$broadcast('scroll.refreshComplete');
			});
		},
		loadOneItem: function(unid) {
			var url = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?unid='+unid
					+'&hierarchical=99'
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
			this._loadItems(url,1,function(entry) {
				_this.all.unshift(entry);				
				_this.selectItem(entry);
			});
		},
		reloadItem: function(item) {
			var url = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?unid='+item.unid
					+'&hierarchical=99'
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK);
			this._loadItems(url,1,function(entry) {
				for(var i=0; i<_this.all.length; i++) {
					darwino.log.d(LOG_GROUP,"Check DiscDB entry="+_this.all[i].unid+", "+entry.unid);
					if(_this.all[i].unid==entry.unid) {
						_this.all[i] = entry;
						_this.selectItem(entry);
						break;
					}
				}
			});
		},
		_loadItems: function(url,itemCount,cb,cball) {
			function absoluteURL(url) {
				var a = document.createElement('a');
				a.href = url;
				return a.href;
			}
			url = absoluteURL(url); 
			var successCallback = function(data, status, headers, config) {
				if(data.length<itemCount) {
					_this.eof = true;
				}
				if(data.length>0) {
					for(var i=0; i<data.length; i++) {
						var entry = data[i];
						cb(entry);
					}
				}
				if(!_this.selectedItem && _this.all.length) {
					_this.selectItem(_this.all[0]);
				}
				if(cball) {
					cball();
				}
				darwino.log.d(LOG_GROUP,'Entries loaded from server: '+url+', #', _this.all.length);
			};
			$http.get(url).success(successCallback);
		},
		allCount: function() {
			return this.all.length;
		},
		
		newPost: function() {
			$rootScope.go('/disc/editpost/new');
		},
		editPost: function(item) {
			$rootScope.go('/disc/editpost/id:'+item.unid);
		},
		deletePost: function(item) {
			$rootScope.nsfdata.deleteDocument(item.unid);
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
		},
		
		newComment: function(item) {
			$rootScope.go('/disc/editpost/pid:'+item.unid);
		},
		
		getAttachments: function(item) {
			if(!item) return null;
			if(!item.attachments) {
				item.attachments = [];
				var jsonfields = jstore.Document.JSON_ALLATTACHMENTS;
				var options = jstore.Store.DOCUMENT_NOREADMARK;
				$http.get(jstore_baseUrl+"/databases/domdisc/stores/nsfdata/documents/"+encodeURIComponent(item.unid)+"?jsonfields="+jsonfields+"&options="+options).success(function(data) {
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
    }
	return _this;
})

//
//	By Date
//
.controller('ByDateCtrl', ['$scope','$rootScope','$http','$ionicModal','entries', function($scope,$rootScope,$http,$ionicModal,entries) {
	var initRTE = function(selector, text) {
		tinymce.init({
			selector: selector,
			menubar: false,
			statusbar: false,
			height: 150,
			
			setup: function(ed) {
				ed.on("LoadContent", function(e) {
					ed.setContent(text);
				});
			}
		});
	}

	
	//
	// Search Bar
	//
	$scope.searchMode = 0;
	$scope.startSearch = function() {
		$scope.searchMode = 1;
	};
	$scope.executeSearch = function() {
		entries.refresh();
	};
	$scope.cancelSearch = function() {
		$scope.searchMode = 0;
		if(entries.ftSearch) {
			entries.ftSearch = "";
			entries.refresh();
		}
	};
	
	// Initialize the data
	entries.refresh();	
}])



//
//	Editor
//
.controller('EditCtrl', ['$scope','$stateParams','$ionicHistory','entries', function($scope,$stateParams,$ionicHistory,entries) {
	// Should we make this async?
	var id = $stateParams.id;
	if(id && darwino.Utils.startsWith(id,'id:')) {
		$scope.doc = $scope.nsfdata.loadDocument(id.substring(3));
	} else {
		$scope.doc = $scope.nsfdata.newDocument();
		if(id && darwino.Utils.startsWith(id,'pid:')) {
			$scope.doc.setParentUnid(id.substring(4));
		}
	}
	$scope.json = $scope.doc.getJson();
	
	$scope.submit = function() {
		var doc = $scope.doc;

		var isNew = doc.isNewDocument();
		doc.save();
		if(isNew && !doc.getParentUnid()) {
			entries.loadOneItem(doc.getUnid());
		} else {
			var root = entries.findRoot(doc.getParentUnid()||doc.getUnid());
			if(root) {
				entries.reloadItem(root); // All hierarchy...
			}
		}
		$ionicHistory.goBack();
	}

	$scope.cancel = function() {
		$ionicHistory.goBack();
	}
	
	$scope.getTitle = function() {
		var doc = $scope.doc;
		if(doc.getParentUnid()) {
			return doc.isNewDocument() ? "New Comment" : "Edit Comment";
		} else {
			return doc.isNewDocument() ? "New Post" : "Edit Post";
		}
	}
}])


//
//	User
//
.controller('UserCtrl', ['$scope','$stateParams','entries', function($scope,$stateParams,entries) {
	$scope.userAttr = "";
	$scope.userPayload = "";
	$scope.userConnAttrs = "";
	$scope.userConnPayload = "";

	$scope.user = userService.findUser($stateParams.userdn, function(user,read) {
		if(read) {
			$scope.user = user;
			$scope.$apply();
		}
	});
}]);
