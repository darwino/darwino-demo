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
var social = darwino.social;

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
