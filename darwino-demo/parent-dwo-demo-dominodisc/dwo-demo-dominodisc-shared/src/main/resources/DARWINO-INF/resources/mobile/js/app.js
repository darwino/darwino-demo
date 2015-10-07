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

var DATABASE_NAME = "domdisc";
var STORE_NAME = "nsfdata";

angular.module('discDb', [ 'ngSanitize','ionic', 'darwino.ionic', 'darwino.angular.jstore', 'ngQuill' ])

.run(function($rootScope,$location,$state,$http,entries) {
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
	$rootScope.reset = function() {
		entries.setInstance($rootScope.context.instance);
		$rootScope.dbPromise = session.getDatabase(DATABASE_NAME, $rootScope.context.instance);
		$rootScope.dbPromise.then(function(database) {
			$rootScope.database = database;
			$rootScope.nsfdata = database.getStore(STORE_NAME);
			$rootScope.apply();
		});
	}
	
//	$rootScope.instances = ['xpagesforum.nsf','nd85forum.nsf','nd8forum.nsf','ndseforum.nsf','nd6forum.nsf'];
//	$rootScope.context.instance = $rootScope.instances[0];
	
	session.getDatabaseInstances(DATABASE_NAME).then(function(instances) {
		$rootScope.instances = instances;
		if(instances && instances.length>0 && $rootScope.context.instance!=instances[0]) {
			$rootScope.context.instance = instances[0];
			$rootScope.reset();
		}
	});


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

	// Initialize the DB with the default instance
	$rootScope.reset();
})

.filter('formattedDate', function() {
	return function(d) {
		return d ? moment(d).fromNow() : '';
	}
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // Enable native scrolls for Android platform only,
    // as you see, we're disabling jsScrolling to achieve this.
//	if(ionic.Platform.isAndroid()) {
//		$ionicConfigProvider.scrolling.jsScrolling(false);
//	}
	
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
	}).state('disc.readpost', {
		url : "/readpost",
		views : {
			'menuContent' : {
				templateUrl : "templates/readpost.html",
				controller : "ReadCtrl"
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

// This is currently a service as the left menu needs access to the count
// let's think about a better architecture here
.service('entries', function($rootScope,$http,$timeout,$jstore,$ionicPopup) {
	// Should this me moved to an initialization servie??
	// Use an object because of prototypical inheritance
	// http://stackoverflow.com/questions/15305900/angularjs-ng-model-input-type-number-to-rootscope-not-updating
	$rootScope.context = {
		instance: "", 		// default instance
		view:     "byDate"  // View
	}
	
	var entries = $jstore.createItemList(session,DATABASE_NAME,STORE_NAME,$rootScope.context.instance)
	
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
		$rootScope.go('/disc/editpost/new');
	}
	entries.editEntry = function(item) {
		var item = item || entries.detailItem;
		if(!item) return;
		$rootScope.go('/disc/editpost/id:'+item.unid);
	}
	entries.newResponse = function(item) {
		var item = item || entries.detailItem;
		if(!item) return;
		$rootScope.go('/disc/editpost/pid:'+item.unid);
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
//	By Date
//
.controller('ByDateCtrl', ['$scope','$rootScope','$http','$ionicModal','entries', function($scope,$rootScope,$http,$ionicModal,entries) {
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
			console.log('scroll.infiniteScrollComplete!');
			//$scope.$broadcast('scroll.resize');
		});
	}
	$scope.refresh = function() {
		entries.refresh( 0, function() {
			darwino.hybrid.setDirty(false);
			$scope.$broadcast('scroll.refreshComplete');
			//$scope.$broadcast('scroll.infiniteScrollComplete');
			console.log('scroll.refreshComplete!');
		});
	}
	
	//
	// Handling attachment
	//
	$scope.openAttachment = function(att) {
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
	
	// Initialize the data
	$scope.refresh();
}])


//
//	Reader
//
.controller('ReadCtrl', ['$scope','$stateParams','$ionicHistory','entries', function($scope,$stateParams,$ionicHistory,entries) {
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
