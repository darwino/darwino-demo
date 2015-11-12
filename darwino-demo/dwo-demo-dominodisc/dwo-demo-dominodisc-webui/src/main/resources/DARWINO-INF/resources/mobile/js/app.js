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
var LOG_GROUP = "app.web";
darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)

var DATABASE_NAME = "domdisc";
var STORE_NAME = "nsfdata";
var INSTANCE_PROP = "dwo.domdisc.instance";

//
// Handling attachment
//
// Desktop browsers will use the link normally, but hybrid mobile
// apps should use special handling.
// This method is used twice below
//
var openAttachmentFunc = function(thisEvent, att, $rootScope, entries) {
	if(darwino.hybrid.isHybrid()) {
		thisEvent.preventDefault();
		
		darwino.hybrid.exec("OpenAttachment",{
			database:DATABASE_NAME, 
			store:STORE_NAME,
			instance:$rootScope.context.instance,
			unid:entries.detailItem.unid, 
			name:att.name,
			file:att.display,
			mimeType:att.mimeType
		});
	}
}

angular.module('app', ['ngSanitize','ionic', 'darwino.ionic', 'darwino.angular.jstore', 'ngQuill' ])

.run(function($rootScope,$location,$state,$http,$window,entries) {
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

	$rootScope.instances = [];
	$rootScope.hasInstances = function() {
		return $rootScope.instances.length>1;  
	}
	$rootScope.instanceChanged = function() {
		var inst = $rootScope.context.instance;
		if(storage) {
			storage.setItem(INSTANCE_PROP,inst);
		}
		$rootScope.reset();
	}
	$rootScope.reset = function() {
		var inst = $rootScope.context.instance;
		entries.setInstance(inst);
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
	
	session.getDatabaseInstances(DATABASE_NAME).then(function(instances) {
		$rootScope.instances = instances;
		if(instances && instances.length>0) {
			var inst = storage ? storage.getItem(INSTANCE_PROP) : null;
			if(!inst || arrayIndexOf(instances,inst)<0) {
				inst = instances[0];
			}
			$rootScope.context.instance = inst;
			$rootScope.instanceChanged();
		}
	});
	
	
//	localStorage.setItem('someName', 'savedData');
//	When you have to retrieve it later you just use:
//	var data = localStorage.getItem('someName');

	$rootScope.entries = entries;
	
	$rootScope.isAnonymous = function() {
		var u = userService.getCurrentUser();
		return !u || u.isAnonymous();
	};
	$rootScope.isReadOnly = function() {
		return this.isAnonymous();
	};
	$rootScope.isFtEnabled = function() {
		return $rootScope.nsfdata && $rootScope.nsfdata.isFtSearchEnabled();
	};
	$rootScope.go = function(path,monoPaneOnly) {
		if(monoPaneOnly) {
			if($rootScope.isDualPane()) {
				return;
			}
		}
		$location.path(path);
	};
	$rootScope.apply = function() {
		setTimeout(function(){$rootScope.$apply()});
	};
	
	$rootScope.displayUser = function(dn) {
        $state.go('app.user',{userdn:dn});
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
	}).state('app.mainview', {
		url : "/mainview",
		views : {
			'menuContent' : {
				templateUrl : "templates/mainview.html",
				controller : "MainViewCtrl"
			}
		}
	}).state('app.readpost', {
		url : "/readpost",
		views : {
			'menuContent' : {
				templateUrl : "templates/readpost.html",
				controller : "ReadCtrl"
			}
		}
	}).state('app.editpost', {
		url : "/editpost/:id",
		views : {
			'menuContent' : {
				templateUrl : "templates/editpost.html",
				controller : "EditCtrl"
			}
		}
	}).state('app.user', {
		url : "/user/:userdn",
		views : {
			'menuContent' : {
				templateUrl : "templates/user.html",
				controller : "UserCtrl"
			}
		}
	});

	$urlRouterProvider.otherwise("/app/mainview");
})

.controller('MainCtrl', function($scope) {
})

// This is currently a service as the left menu needs access to the count
.service('entries', function($rootScope,$http,$timeout,$jstore,$ionicPopup) {
	// Should this me moved to an initialization service?
	// Use an object because of prototypical inheritance
	// http://stackoverflow.com/questions/15305900/angularjs-ng-model-input-type-number-to-rootscope-not-updating
	$rootScope.context = {
		instance: 	"", 		// default instance
		view:     	"MainView"  // View
	}
	
	var entries = $jstore.createItemList(session,DATABASE_NAME,STORE_NAME,$rootScope.context.instance)
	entries.orderBy = "_cdate desc";
	
	// Specific methods
	entries.getUserDn = function(item) {
		return item ? item.value.from : null;
	}
	entries.getUser = function(item) {
		if(item) {
			if($rootScope.accessUserService) {  
				return userService.getUser(item.value.from,function(u,n){if(n){$rootScope.apply()}})
			}
			return userService.createUser(item.value.from);
		}
		return darwino.services.User.ANONYMOUS_USER;
	}
	entries.getPhoto =  function(item) {
		if(item) {
			if($rootScope.accessUserService) {  
				return userService.getUserPhotoUrl(item.value.from);
			}
		}
		return darwino.services.User.ANONYMOUS_PHOTO;
	}
	entries.newPost = function() {
		$rootScope.go('/app/editpost/new');
	}
	entries.editEntry = function(item) {
		var item = item || entries.detailItem;
		if(!item) return;
		$rootScope.go('/app/editpost/id:'+item.unid);
	}
	entries.newResponse = function(item) {
		var item = item || entries.detailItem;
		if(!item) return;
		$rootScope.go('/app/editpost/pid:'+item.unid);
	}
	entries.deleteEntry = function(item) {
		var item = item || entries.detailItem;
		if(!item) return;
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete entry',
			template: 'Are you sure you want to delete this document?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				entries.deleteItem(item);
			}
		});
	}
	return entries;
})

//
//	Main View
//
.controller('MainViewCtrl', ['$scope','$rootScope','$http','$ionicModal','entries', function($scope,$rootScope,$http,$ionicModal,entries) {
	//
	//
	//
	$scope.hasMore = function() {
		return entries.hasMore();
	}
	$scope.hasMoreButton = function() {
		return !$rootScope.infiniteScroll && entries.hasMore() && !entries.isLoading();
	}
	$scope.loadMore = function() {
		entries.loadMore( function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}
	$scope.refresh = function() {
		entries.refresh( 0, function() {
			darwino.hybrid.setDirty(false);
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
	
	//
	// Handling attachment
	//
	$scope.openAttachment = function(thisEvent, att) {
		openAttachmentFunc(thisEvent, att, $rootScope, entries);
	};

	//
	// Search Bar
	//
	$scope.searchMode = 0;
	$scope.startSearch = function() {
		$scope.searchMode = 1;
	};
	$scope.executeSearch = function() {
		entries.refresh(500);
	};
	$scope.cancelSearch = function() {
		$scope.searchMode = 0;
		if(entries.ftSearch) {
			entries.ftSearch = "";
			entries.refresh();
		}
	};
}])


//
//	Reader
//
.controller('ReadCtrl', ['$scope','$rootScope','$stateParams','$ionicHistory','entries', function($scope,$rootScope,$stateParams,$ionicHistory,entries) {
	//
	// Handling attachment
	//
	$scope.openAttachment = function(thisEvent, att) {
		openAttachmentFunc(thisEvent, att, $rootScope, entries);
	};
}])


//
//	Editor
//
.controller('EditCtrl', ['$scope','$stateParams','$ionicHistory','entries', function($scope,$stateParams,$ionicHistory,entries) {
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
			var p = doc.save();
			p.then(function() {
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
		}
	}

	$scope.cancel = function() {
		$ionicHistory.goBack();
	}
	
	$scope.getTitle = function() {
		var doc = $scope.doc;
		if(doc) {
			if(doc.getParentUnid()) {
				return doc.isNewDocument() ? "New Comment" : "Edit Comment";
			} else {
				return doc.isNewDocument() ? "New Post" : "Edit Post";
			}
		}
		return "";
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

	$scope.user = userService.getUser($stateParams.userdn, function(user,read) {
		if(read) {
			$scope.user = user;
			$scope.apply();
		}
	});
}]);
