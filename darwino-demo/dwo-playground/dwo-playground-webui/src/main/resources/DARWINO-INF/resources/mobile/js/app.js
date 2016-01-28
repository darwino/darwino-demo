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

// Enable some logging
var LOG_GROUP = "Playground.web";
darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)

angular.module('Playground', [ 'ngSanitize','ionic' ])

.run(function($rootScope,$location) {
	// Make some global var visible
	$rootScope.darwino = darwino;
	$rootScope.session = session;
	$rootScope.userService = userService;
	
	$rootScope.menuMain = true;
	$rootScope.menuSync = true;
	$rootScope.menuSettings = true;
	$rootScope.toggleMenu = function(menu) {
		$rootScope[menu] = !$rootScope[menu]; 
	}

	$rootScope.isAnonymous = function() {
		var u = userService.getCurrentUser();
		return !u || u.isAnonymous();
	};
	$rootScope.isReadOnly = function() {
		return this.isAnonymous();
	};
	$rootScope.go = function(path) {
		$location.path(path);
	};
	
	darwino.hybrid.addSettingsListener(function(){
		$rootScope.$apply()
	});
})

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('Playground', {
		url : "/Playground",
		abstract : true,
		templateUrl : "templates/main.html"
	}).state('Playground.home', {
		url : "/home",
		views : {
			'menuContent' : {
				templateUrl : "templates/home.html"
			}
		}
	});

	$urlRouterProvider.otherwise("/Playground/home");
})


//
//	Main controller
//
.controller('MainCtrl', ['$scope','$http', function($scope,$http) {
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
	
}])



//
//	Profile controller
//
.controller('ProfileCtrl', function($scope) {
});
