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

var jstore = darwino.jstore;
var services = darwino.services;

var app_baseUrl = "$darwino-app";
var jstore_baseUrl = "$darwino-jstore";
var social_baseUrl = "$darwino-social";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();
var userService = services.createUserService(social_baseUrl+"/users");

var DATABASE_NAME = "todolist";
var STORE_NAME = "todos";

// http://jsfiddle.net/BkXyQ/6/
angular.module('app', ['ngSanitize','ngRoute','darwino.angular.jstore'])

.run(function($rootScope) {
	$rootScope.isAnonymous = function() {
		var u = userService.getCurrentUser();
		return !u || u.isAnonymous();
	};
	$rootScope.getUser = function(id) {
		if(id && $rootScope.accessUserService) {
			// Ensure that we get the load notification only once (the users has not been requested yet)
			// Not that the cache can be filled from a multiple user requests as well
			var u = userService.getUserFromCache(id);
			if(u) {
				return u;
			}
			var u = userService.getUser(id,function(u,loaded) {
				$rootScope.apply(); 
			});
			return u || darwino.services.User.ANONYMOUS_USER;
		}
		return userService.createUser(id);
	};
	$rootScope.getPhoto = function(id) {
		if(id) {  
			return userService.getUserPhotoUrl(id);
		}
		return darwino.services.User.ANONYMOUS_PHOTO;
	};
})

.config(function($routeProvider) {
	$routeProvider
		.when('/', { templateUrl: "templates/list.html"} )
		.when('/detail', { templateUrl: "templates/detail.html"} )
		.when('/info', { templateUrl: "templates/info.html"} )
		.otherwise({redirectTo: '/'})
})

.directive('listDone', function() {
	return function(scope, element, attrs) {
		if (scope.$last) { // all are rendered
			scope.$eval(attrs.listDone);
		}
	}
})

.directive('onEnter', function() {
	return function(scope, element, attrs) {
		element.on('keydown', function(event) {
			if (event.which === 13) {
				scope.$apply(attrs.onEnter);
			}
		})
	}
})

.service('viewEntries', function($q, $rootScope, $jstore) {
	var entries = $jstore.createItemList(session)
	p = {
		database: DATABASE_NAME,
		store: STORE_NAME,
		instanceId: 'discdb/xpagesforum.nsf',
		orderBy: "_cdate desc",
		jsonTree: true,
		hierarchical: 99,
		options: jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES+jstore.Cursor.DATA_WRITEACC
	};
	entries.initCursor(p);
	entries.getUserDn = function(item) {
		if(item && item.value) {
			return item.value.assignedTo;
		}
		return null;
	}
	entries.getUser = function(item) {
		if(item) {
			return $rootScope.getUser(this.getUserDn(item));
		}
		return darwino.services.User.ANONYMOUS_USER;
	}
	entries.getPhoto = function(item) {
		if(item) {
			return $rootScope.getPhoto(this.getUserDn(item));
		}
		return darwino.services.User.ANONYMOUS_PHOTO;
	}
	return entries;
})

.filter('formattedDate', function() {
	return function(d) {
		return d ? moment(d).fromNow() : '';
	}
})
.filter('abstractText', function() {
	return function(d) {
		return d && d.length>60 ? d.substring(0,60) : d;
	}
})

.controller('AppCtrl', function($scope, $location, $timeout, viewEntries) {
	$scope.entries = viewEntries;
	
	$scope.scrollPos = {}; // scroll position of each view

	$(window).on('scroll', function() {
		if ($scope.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
			$scope.scrollPos[$location.path()] = $(window).scrollTop();
			//console.log($scope.scrollPos);
		}
	});

	$scope.scrollClear = function(path) {
		$scope.scrollPos[path] = 0;
	}

	$scope.$on('$routeChangeStart', function() {
		$scope.okSaveScroll = false;
	});

	$scope.$on('$routeChangeSuccess', function() {
		$timeout(function() { // wait for DOM, then restore scroll position
			$(window).scrollTop($scope.scrollPos[$location.path()] ? $scope.scrollPos[$location.path()] : 0);
			$scope.okSaveScroll = true;
		}, 100);
	});

	$scope.ifPathNot = function(path) {
		return $location.path() != path;
	}

	$scope.isOwner = function(path) {
		return true;
	}

	$scope.setCurrEntry = function(entry) {
		$scope.currEntry = entry;
	}
})

.controller('ListCtrl', function($scope, $location, $timeout) {
	$scope.viewDetail = function(entry) {
		$scope.setCurrEntry(entry);
		$location.path('/detail');
	}
})

.controller('DetailCtrl', function($scope, $location) {
	$scope.scrollClear($location.path());
})

.controller('InfoCtrl', function($scope, $location, $http) {
	var _userInfo = null;
	$scope.getUserInformation = function() {
		if(!_userInfo) {
			_userInfo = "<Fetching User Information>"
			userService.getCurrentUser(function(u) {
				_userInfo = darwino.Utils.toJson({
					dn:	u.getDn(),
					cn:	u.getCn(),
					groups:	u.getGroups(),
					roles:	u.getRoles()
				},false);
			});
		}
		return _userInfo;
	}

	var _appInfo = null;
	$scope.getAppInformation = function() {
		if(!_appInfo) {
			_appInfo = "<Fetching Application Information>"
			var successCallback = function(data, status, headers, config) {
				_appInfo = darwino.Utils.toJson(data,false);
			};
			var url = "$darwino-app"
			$http.get(url).success(successCallback);
		}
		return _appInfo;
	};	
})
