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

var DEFAULT_STATE_URL = "/app/views/bydate";

angular.module('app', ['ngSanitize','ionic', 'darwino.ionic', 'darwino.angular.jstore', 'ngQuill' ])

.run(['$rootScope','$location','$state','$http','$window','views',function($rootScope,$location,$state,$http,$window,views) {
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
	$rootScope.infiniteScroll = true;
	$rootScope.accessUserService = true;
	
	// Make some global variables visible
	$rootScope.darwino = darwino;
	$rootScope.session = session;
	$rootScope.userService = userService;

	// Make the data models globally available so the navigator can access them
	// Could also be provided as a service to avoid the pollution of $rooScope
	$rootScope.data = {
		// Global information maintained
		instances: [],
		instance: "",
	}
	
	// Should this me moved to an initialization service?
	// Use an object because of prototypical inheritance
	// http://stackoverflow.com/questions/15305900/angularjs-ng-model-input-type-number-to-rootscope-not-updating
	if(USE_INSTANCES) {
		$rootScope.hasInstances = function() {
			return $rootScope.data.instances.length>1;  
		}
		$rootScope.instanceChanged = function() {
			var inst = $rootScope.data.instance;
			if(storage) {
				storage.setItem(INSTANCE_PROP,inst);
			}
			$rootScope.reset();
	        $state.go("app.views",{view:'bydate'});
		}
	}
	$rootScope.reset = function() {
		var inst = null;
		if(USE_INSTANCES) {
			inst = $rootScope.data.instance;
		}
		views.reset();
		$rootScope.database = null;
		$rootScope.nsfdata = null;
		$rootScope.dbPromise = session.getDatabase(DATABASE_NAME,inst);
		$rootScope.dbPromise.then(function(database) {
			$rootScope.database = database;
			$rootScope.nsfdata = database.getStore(STORE_NAME);
			$rootScope.apply();
		});
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
		if(id && $rootScope.accessUserService) {  
			var u =null
			var u = userService.getUser(id,function(u,loaded) {
				if(loaded) $rootScope.apply();
			});
			return u || darwino.services.User.ANONYMOUS_USER;
		}
		return userService.createUser(id);
	};
	$rootScope.getPhoto = function(id) {
		if(id && $rootScope.accessUserService) {  
			return userService.getUserPhotoUrl(id);
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

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if(toState.name=="app.read" || toState.name=="app.edit") {
			if(!$rootScope.entries) {
				event.preventDefault();
			}
		}
	})	
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		if(toState.name=="app.views") {
			var view = toParams.view;
			views.select(view);
		} else if(toState.name=="app.author") {		
			var author = toParams.author;
			views.select('author',{author:author});
		}
	})
	
	// Initialization
	if(USE_INSTANCES) {
		$http.get(app_baseUrl+"/instances").then(function(response) {
			var instances = response.data;
			$rootScope.data.instances = instances;
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
	}).state('app.views', {
		url : "/views/:view",
		views : {
			'menuContent' : {
				templateUrl : "templates/mainview.html",
				controller : "ViewsCtrl",
			}
		},
		resolve:{
			view: ['$stateParams', function($stateParams){
				return $stateParams.view;
		    }]
		}	
	}).state('app.author', {
		url : "/author/:author",
		views : {
			'menuContent' : {
				templateUrl : "templates/mainview.html",
				controller : "DocsAuthor",
			}
		}	
	}).state('app.read', {
		url : "/read",
		views : {
			'menuContent@app' : {
				templateUrl : "templates/readitem.html",
				controller : "ReadCtrl",
			}
		}
	}).state('app.edit', {
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

	$urlRouterProvider.otherwise(DEFAULT_STATE_URL);
}])


//
// Service to access the documents
//
.service('views', ['$rootScope','$state','$jstore','$ionicPopup',function($rootScope,$state,$jstore,$ionicPopup) {
	// We cache the entries share the list in memory
	var allEntries = {};
	this.reset = function() {
		for(var k in allEntries) {
			var e = allEntries[k];
			e.setInstance($rootScope.data.instance);
			e.resetCursor();
		}
	}
	this.select = function(view,params) {
		return $rootScope.entries = this.getEntries(view,params);
	}
	this.getEntries = function(view,params) {
		// Look for the entries in the cache
		// For parameterized views, we only keep one copy in the cache
		var v = allEntries[view]
		if(v) {
			if(!params || angular.equals(params,v.params)) {
				return v;
			}
		}
		return allEntries[view] = this.createEntries(view,params)
	}
	this.createEntries = function(view,params) {
		var entries = $jstore.createItemList(session)
		entries.view = view;
		entries.params = params;

		var p;
		if(view=='bydate') {
			p = {
				database: DATABASE_NAME,
				store: STORE_NAME,
				orderBy: "_cdate desc",
				jsonTree: true,
				hierarchical: 99,
				options: jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK
			};
		} else if(view=='byauthor') {
			p = {
				database: DATABASE_NAME,
				store: STORE_NAME,
				orderBy: "_cuser, _cdate desc",
				categoryCount: 1,
				aggregate: "{ Count: {$count: '$'} }",
				options: jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_CATONLY
			};
		} else if(view=='author') {
			p = {
				database: DATABASE_NAME,
				store: STORE_NAME,
				orderBy: "_cuser, _cdate desc",
				query: "{'_cuser':\""+params.author+"\"}",
				parentId: '*',
				jsonTree: true,
				hierarchical: 99,
				options: jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_READMARK
			};
		} else {
			// Unknown view...
			return;
		}
		if(params) {
			angular.merge(p,params);
		}
		entries.initCursor(p);
		
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
				return $rootScope.getUser(this.getUserDn(item));
			}
			return darwino.services.User.ANONYMOUS_USER;
		}
		entries.getPhoto =  function(item) {
			if(item) {
				return $rootScope.getPhoto(this.getUserDn(item));
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
			$state.go("app.edit",{view:entries.view});
		}
		entries.readEntry = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			if(item.category) {
				var dn = item.key;
				$state.go('app.author',{author:dn});
			} else {
				$rootScope.go("app.read",true);
			}
		}
		entries.editEntry = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			$state.go("app.edit",{view:entries.view,id:"id:"+item.unid});
		}
		entries.newResponse = function(item) {
			var item = item || entries.detailItem;
			if(!item) return;
			$state.go("app.edit",{view:entries.view,id:"pid:"+item.unid});
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
			});
		}
		
		entries.hasMoreButton = function() {
			return !$rootScope.infiniteScroll && this.hasMore() && !this.isLoading();
		}

		entries.onItemLoaded = function(item) {
			// Sort the children by date
			if(item.children) {
				item.children.sort(function(i1,i2) {
					return i2.cdate-i1.cdate;
				})
			}
		}
		
		var oldLoadMore = entries.loadMore; 
		entries.loadMore = function() {
			function broadcast() {
				$rootScope.$broadcast('scroll.infiniteScrollComplete');
			}
			if(!oldLoadMore.call(this,broadcast)) {
				broadcast();
			};
		}

		var oldReload = entries.reload; 
		entries.reload = function(delay) {
			oldReload.call( this, delay, function() {
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
			this.searchMode = 1;
		};
		entries.executeSearch = function() {
			this.reload(500);
		};
		entries.cancelSearch = function() {
			this.searchMode = 0;
			if(this.ftSearch) {
				this.ftSearch = "";
				this.reload();
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
.controller('ViewsCtrl', ['$rootScope','$scope','$state','$stateParams','views', function($rootScope,$scope,$state,$stateParams,views) {
}])

.controller('DocsAuthor', ['$rootScope','$scope','$state','$stateParams','views', function($rootScope,$scope,$state,$stateParams,views) {
}])


//
//	Reader
//
.controller('ReadCtrl', ['$scope', '$rootScope','views', function($scope,$rootScope,views) {
}])


//
//	Editor
//
.controller('EditCtrl', ['$scope', '$rootScope','$state','$stateParams','$ionicHistory','views', function($scope,$rootScope,$state,$stateParams,$ionicHistory,views) {
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
		var entries = $rootScope.entries;
		var doc = $scope.doc;
		if(doc) {
			doc.convertAttachmentUrlsForStorage();
			
			var isNew = doc.isNewDocument();
			doc.save().then(function() {
				doc.convertAttachmentUrlsForDisplay();
				
				// We should go back to the previous once the item are reloaded
				// Else it will display the old data
				if(isNew && !doc.getParentUnid()) {
					entries.loadOneItem(doc.getUnid(),function(){$ionicHistory.goBack()});
				} else {
					// We either refresh the parent, when it exists, or the doc itself
					var root = entries.findRoot(doc.getParentUnid()) || entries.findRoot(doc.getUnid());
					if(root) {
						entries.reloadItem(root,function(){$ionicHistory.goBack()});
					} else {
						$ionicHistory.goBack();					
					}
				}
			})
		}
	}

	$scope.cancel = function() {
		$ionicHistory.goBack();
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
