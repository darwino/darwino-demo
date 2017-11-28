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

/*
 * Some Angular/Ionic utilities for a Darwino application
 */
(function() {
	var mod = angular.module('darwino.angular', []);

	//
	// Debug data binding
	//
	mod.directive('jsonModel', function() {
		return {
			restrict : 'A',
			require : 'ngModel',
			link : function(scope, elem, attr, ctrl) {
				ctrl.$parsers.push(function(value) {
					return darwino.Utils.fromJson(value);
				});
				ctrl.$formatters.push(function(modelValue) {
					return darwino.Utils.toJson(modelValue, false);
				});
			}
		};
	});	
	
	//
	// Create a user service and make it available via an Angular service
	//
	var userSvc = darwino.services.createUserService("$darwino-social/users");
	mod.service('userService', [function() {
		return userSvc;
	}]);
	
	
	//
	// Apply the changes later, when it comes idle
	// Make sure that this is only executed once
	//	
	mod.service('notifyDataChange', ['$timeout',function($timeout) {
		var pendingApply = null;
		return function() {
			if(!pendingApply) {
				pendingApply = $timeout(function(){pendingApply=null});
			}
		};
	}]);
	
	//
	// User formatters
	// The filters are stateful as the Cn/Dn is retrieved asynchronously and thus can change later
	//
	mod.filter('userDn', ['notifyDataChange', function(notifyDataChange) {
		var f = function(id) {
			return userSvc.getUser(id,notifyDataChange).getDn();
		}
		f.$stateful = true;
		return f;
	}]);

	mod.filter('userCn', ['notifyDataChange', function(notifyDataChange) {
		var f = function(id) {
			return userSvc.getUser(id,notifyDataChange).getCn();
		}
		f.$stateful = true;
		return f;
	}]);
	mod.filter('userPhotoUrl', [function() {
		return function(id) {
			return userSvc.getUserPhotoUrl(id);
		}
	}]);

	
	//
	// Date formatters
	//
	mod.filter('dateFromNow', [function() {
		return function(d) {
			return d ? moment(d).fromNow() : '';
		}
	}]);

	
	//
	// Intercept the authentication requests and broadcast an event
	//
	mod.factory('httpAuthenticationInterceptor', ['$q', '$injector', '$rootScope', function($q, $injector, $rootScope) {  
	    var interceptor = {
	    	unauthorized: function() {
	    		$rootScope.$broadcast('dwo-unauthorized');
	    	},
	        responseError: function(response) {
	        	var status = response.status; 
	            // Session requires authentication
	            if (status==401 || status==419 || response.headers('x-dwo-auth-msg')=='authrequired' ){
	            	interceptor.unauthorized(response);
		            return $q.reject(response);
	            } else if(status<200 || status>299) {
		            return $q.reject(response);
	            }
				return response;
	        }
	    };
	    return interceptor;
	}]);
	mod.config(['$httpProvider', function($httpProvider) {  
	    $httpProvider.interceptors.push('httpAuthenticationInterceptor');
	}]);
	
	
	//
	// Script functions
	// This can be tweaked going forwarded and only generated if functions are being used
	//
	mod.service('func', [function() {
		var fct = {
			// User access
			userName: function() {
				// Warn: this can return a temporary user...
				var u = userSvc.getCurrentUser();
				return u.getDn();
			},
			
			// String functions
			text: function(o) {
				return o ? o.toString() : "";
			},
			lowerCase: function(o) {
				return fct.text(o).toLowerCase();
			},
			properCase: function(o) {
				var v = fct.text(o).toLowerCase();
			},
			upperCase: function(o) {
				return fct.text(o).toUpperCase();
			},
			left: function(str,len) {
				if(angular.isString(str) && angular.isNumber(len) && len>0) {
					return str.substring(0,len);
				}
				return str;
			},
			right: function(str,len) {
				if(angular.isString(str) && angular.isNumber(len) && len>0) {
					return str.substring(Math.max(0,str.length-len),len);
				}
				return str;
			}
		}
		return fct;
	}]);
	
})();
