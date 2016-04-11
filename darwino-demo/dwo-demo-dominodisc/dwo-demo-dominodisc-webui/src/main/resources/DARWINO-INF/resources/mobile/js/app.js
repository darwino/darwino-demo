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

(function() {
	
var jstore = darwino.jstore;
var services = darwino.services;

var app_baseUrl = "$darwino-app";
var jstore_baseUrl = "$darwino-jstore";
var social_baseUrl = "$darwino-social";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();
var userService = services.createUserService(social_baseUrl+"/users");

// Enable some logging
var LOG_GROUP = "app.web";
darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)

var DATABASE_NAME = "domdisc";
var STORE_NAME = "nsfdata";
var USE_INSTANCES = true;

if(USE_INSTANCES) {
	var INSTANCE_PROP = "dwo.domdisc.instance";
}

angular.module('app', ['ngSanitize','ionic', 'darwino.ionic', 'darwino.angular.jstore', 'ngQuill' ])

.run(['$rootScope','$location','$state','$http','$window',function($rootScope,$location,$state,$http,$window) {
	// Storage utilities
	function storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null ? window.localStorage : null;
		} catch(e){
			return null;
		}
	}	
	function arrayIndexOf(a, obj) {
	    var i = a.length;
	    while (i--) {
	       if (a[i] === obj) {
	           return i;
	       }
	    }
	    return -1;
	}
	var storage = storage(); 
	
	// Some options
	$rootScope.infiniteScroll = false;
	$rootScope.accessUserService = true;
	
	// Make some global var visible
	$rootScope.darwino = darwino;
	$rootScope.session = session;
	$rootScope.userService = userService;

	// Make the data models globally available so the navigator can access them
	// Could also be provided as a service to avoid the pollution of $rooScope
	$rootScope.data = {
		// Global information maintained
		instance: null,
		// Data as loaded by the controllers
		bydate: {},
		byauthor: {}
	}
	
	// Should this me moved to an initialization service?
	// Use an object because of prototypical inheritance
	// http://stackoverflow.com/questions/15305900/angularjs-ng-model-input-type-number-to-rootscope-not-updating
	if(USE_INSTANCES) {
		$rootScope.data.instance = ""; // default instance
		$rootScope.instances = [];
		$rootScope.hasInstances = function() {
			return $rootScope.instances.length>1;  
		}
		$rootScope.instanceChanged = function() {
			var inst = $rootScope.data.instance;
			if(storage) {
				storage.setItem(INSTANCE_PROP,inst);
			}
			$rootScope.reset();
		}
	}
	$rootScope.reset = function() {
		var inst = null;
		if(USE_INSTANCES) {
			inst = $rootScope.data.instance;
		}
		$rootScope.dbPromise = session.getDatabase(DATABASE_NAME,inst);
		$rootScope.dbPromise.then(function(database) {
			$rootScope.database = database;
			$rootScope.nsfdata = database.getStore(STORE_NAME);
			$rootScope.apply();
		});
		$rootScope.database = null;
		$rootScope.nsfdata = null;
	}

	$rootScope.isDualPane = function() {
		if($window.matchMedia("(min-width:768px)").matches) {
			return true;
		}
		return false
	}
	
	
	$rootScope.isAnonymous = function() {
		var u = userService.getCurrentUser();
		return !u || u.isAnonymous();
	};
	$rootScope.getUser = function(id) {
		var u = userService.getUser(id,function(u,loaded) {
			if(loaded) $rootScope.apply();
		});
		return u || darwino.services.User.ANONYMOUS_USER;
	};
	$rootScope.getPhoto = function(id) {
		if(id) {
			if($rootScope.accessUserService) {  
				return userService.getUserPhotoUrl(id);
			}
		}
		return darwino.services.User.ANONYMOUS_PHOTO;
	};
	$rootScope.go = function(path,monoPaneOnly) {
		if(monoPaneOnly) {
			if($rootScope.isDualPane()) {
				return;
			}
		}
		$state.go(path)
	};
	$rootScope.apply = function() {
		setTimeout(function(){$rootScope.$apply()});
	};
	
	$rootScope.displayUser = function(dn) {
        $state.go('app.user',{userdn:dn});
    }	
	
	$rootScope.isState = function(state,params) {
        if($state.includes(state)) {
        	if(params) {
        		for(var p in params) {
        			if($state.params[p]!=params[p]) {
        				return false;
        			}
        		}
        	}
        	return true;
        }
        return false;
    }	
	
	darwino.hybrid.addSettingsListener(function(){
		$rootScope.apply();
	});
	
	// Initialization
	if(USE_INSTANCES) {
		$http.get(app_baseUrl+"/instances").then(function(response) {
			var instances = response.data;
			$rootScope.instances = instances;
			if(instances && instances.length>0) {
				var inst = storage ? storage.getItem(INSTANCE_PROP) : null;
				if(!inst || arrayIndexOf(instances,inst)<0) {
					inst = instances[0];
				}
				$rootScope.data.instance = inst;
				$rootScope.instanceChanged();
			}
		})
	} else {
		setTimeout(function(){$rootScope.reset()});
	}	
}])

.filter('formattedDate', function() {
	return function(d) {
		return d ? moment(d).fromNow() : '';
	}
})


//
// State provider
//
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$stateProvider.state('app', {
		url : "/app",
		abstract : true,
		templateUrl : "templates/leftmenu.html"
	}).state('app.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "templates/home.html"
			}
		}
	}).state('app.docs', {
		url : "/docs/:view",
		views : {
			'menuContent' : {
				templateUrl : "templates/mainview.html",
				controller : "DocsCtrl",
			}
		},
		resolve:{
			view: ['$stateParams', function($stateParams){
				return $stateParams.view;
		    }]
		}	
	}).state('app.docs.read', {
		url : "/read",
		views : {
			'menuContent@app' : {
				templateUrl : "templates/readitem.html",
				controller : "ReadCtrl",
			}
		}
	}).state('app.docs.edit', {
		url : "/edit/:id",
		views : {
			'menuContent@app' : {
				templateUrl : "templates/edititem.html",
				controller : "EditCtrl"
			}
		}
	}).state('app.user', {
		url : "/user/:userdn",
		views : {
			'menuContent@app' : {
				templateUrl : "templates/user.html",
				controller : "UserCtrl"
			}
		}
	});

	$urlRouterProvider.otherwise("/app/docs/bydate");
}])


//
// Service to access the documents
//
.service('discDocs', ['$rootScope','$state','$jstore','$ionicPopup',function($rootScope,$state,$jstore,$ionicPopup) {
	// We cache the entries share the list in memory
	var allEntries = {};
	this.getEntries = function(view) {
		var v = allEntries[view]
		if(v) return v;

		var entries = allEntries[view] = $jstore.createItemList(session)
		entries.view = view;

		if(view=='bydate') {
			entries.initCursor({
				database: DATABASE_NAME,
				store: STORE_NAME,
				orderBy: "_cdate desc"
			});
			$rootScope.data.bydate = entries;
		} else if(view=='byauthor') {
			entries.initCursor({
				database: DATABASE_NAME,
				store: STORE_NAME,
				orderBy: "_cuser",
				categoryCount: 1
			});
			$rootScope.data.byauthor = entries;
		}
		
		if(USE_INSTANCES) {
			entries.setInstance($rootScope.data.instance);
		}
		
		// Specific methods
		entries.getUserDn = function(item) {
			if(item && item.value && item.value._writers && item.value._writers.from) {
				var a = item.value._writers.from;
				if(darwino.Utils.isArray(a)) {
					return a.length==1 ? a[0] : null;
				}
				return a;
			}
			return null;
		}
		entries.getUser = function(item) {
			if(item) {
				if($rootScope.accessUserService) {  
					return userService.getUser(this.getUserDn(item),function(u,n){if(n){$rootScope.apply()}})
				}
				return userService.createUser(this.getUserDn(item));
			}
			return darwino.services.User.ANONYMOUS_USER;
		}
		entries.getPhoto =  function(item) {
			if(item) {
				if($rootScope.accessUserService) {  
					return userService.getUserPhotoUrl(this.getUserDn(item));
				}
			}
			return darwino.services.User.ANONYMOUS_PHOTO;
		}
		entries.isReadOnly = function() {
			return $rootScope.isAnonymous();
		};
		entries.isFtEnabled = function() {
			return $rootScope.nsfdata && $rootScope.nsfdata.isFtSearchEnabled();
		};
		entries.isCategory = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			return item.category==true;
		}
		entries.newEntry = function() {
			$state.go("app.docs.edit",{view:entries.view});
		}
		entries.readEntry = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			if(item.category) {
				var dn = entries.getUserDn(item);
				$rootScope.go('app.user',true,{userdn:dn});
			} else {
				$rootScope.go("app.docs.read",true);
			}
		}
		entries.editEntry = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			$state.go("app.docs.edit",{view:entries.view,id:"id:"+item.unid});
		}
		entries.newResponse = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			$state.go("app.docs.edit",{view:entries.view,id:"pid:"+item.unid});
		}
		entries.deleteEntry = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			$ionicPopup.confirm({
				title: 'Delete entry',
				template: 'Are you sure you want to delete this document?'
			}).then(function(res) {
				if(res) {
					entries.deleteItem(item);
				}
				$state.go("app.docs",{view:entries.view});
			});
		}
		
		entries.hasMore = function() {
			return entries.hasMore();
		}
		entries.hasMoreButton = function() {
			return !$rootScope.infiniteScroll && entries.hasMore() && !entries.isLoading();
		}
		entries.loadMore = function() {
			entries.loadMore( function() {
				$rootScope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
		entries.refresh = function(delay) {
			entries.reload( delay, function() {
				darwino.hybrid.setDirty(false);
				$rootScope.$broadcast('scroll.refreshComplete');
			});
		}
		
		//
		// Handling attachments
		//
		entries.openAttachment = function(thisEvent, att) {
			entries.openAttachmentFunc(thisEvent, att);
		};
	
		//
		// Search Bar
		//
		entries.searchMode = 0;
		entries.startSearch = function() {
			entries.searchMode = 1;
		};
		entries.executeSearch = function() {
			entries.refresh(500);
		};
		entries.cancelSearch = function() {
			entries.searchMode = 0;
			if(entries.ftSearch) {
				entries.ftSearch = "";
				entries.refresh();
			}
		};
		
		return entries;
	}
}])


//
//	Main controller for the whole page
//
.controller('MainCtrl', [function() {
}])
	


//
//	Views
//
.controller('DocsCtrl', ['$rootScope','$scope','$state','$stateParams','discDocs', function($rootScope,$scope,$state,$stateParams,discDocs) {
	var view = $stateParams.view;
	var entries = $scope.entries = discDocs.getEntries(view);
	entries.view = view;
	
	entries.refresh();	
}])


//
//	Reader
//
.controller('ReadCtrl', ['$scope', '$rootScope','discDocs','view', function($scope,$rootScope,discDocs,view) {
	$scope.entries = discDocs.getEntries(view);
}])


//
//	Editor
//
.controller('EditCtrl', ['$scope', '$rootScope','$state','$stateParams','$ionicHistory','discDocs','view', function($scope,$rootScope,$state,$stateParams,$ionicHistory,discDocs,view) {
	var entries = $scope.entries = discDocs.getEntries(view);
	
	var id = $stateParams.id;
	$scope.doc = null;
	$scope.json = null;
	$scope.dbPromise.then(function() {
		if(id && darwino.Utils.startsWith(id,'id:')) {
			return $scope.nsfdata.loadDocument(id.substring(3));
		} else {
			return $scope.nsfdata.newDocument();
		}
	}).then(function (doc) {
		if(id && darwino.Utils.startsWith(id,'pid:')) {
			doc.setParentUnid(id.substring(4));
		}
		doc.convertAttachmentUrlsForDisplay();
		$scope.doc = doc;
		$scope.json = doc.getJson();
		$scope.apply();
	});
	
	$scope.submit = function() {
		var doc = $scope.doc;
		if(doc) {
			doc.convertAttachmentUrlsForStorage();
			
			var isNew = doc.isNewDocument();
			doc.save().then(function() {
				doc.convertAttachmentUrlsForDisplay();
				
				if(isNew && !doc.getParentUnid()) {
					entries.loadOneItem(doc.getUnid());
				} else {
					var root = entries.findRoot(doc.getParentUnid()||doc.getUnid());
					if(root) {
						entries.reloadItem(root); // All hierarchy...
					}
				}
			})
			$ionicHistory.goBack();
			//$state.go("^");
		}
	}

	$scope.cancel = function() {
		$ionicHistory.goBack();
		//$state.go("^");
	}
	
	$scope.getTitle = function() {
		var doc = $scope.doc;
		if(doc) {
			return doc.isNewDocument() ? "New Entry" : "Edit Entry";
		}
		return "";
	}
}])


//
//	User
//
.controller('UserCtrl', ['$scope','$stateParams', function($scope,$stateParams) {
	$scope.userAttr = "";
	$scope.userPayload = "";
	$scope.userConnAttrs = "";
	$scope.userConnPayload = "";

	$scope.user = userService.getUser($stateParams.userdn, function(user,read) {
		if(read) {
			$scope.user = user;
			$scope.apply();
		}
	});
}])

}());
