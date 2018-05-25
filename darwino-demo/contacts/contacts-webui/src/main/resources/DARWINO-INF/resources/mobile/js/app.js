/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
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
    var module = angular.module('app', ['darwino.angular','darwino.angular.jstore','darwino.ionic','ionic','ngQuill','ngSanitize']);
    // 
    // Page Router
    // 
    module.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        // Abstract state used to provide the main layout
        $stateProvider.state('app', {
        	url : '/app',
        	abstract : true,
        	templateUrl : 'templates/mainnav.html'
        });
        // Form - about
        $stateProvider.state('app.about', {
            url: '/about',
            // This allows the parameter to be optional without a trailing slash
            params: {
                id: {squash:true, value:null}
            },
            views: {
                'menuContent': {
                    template:
                       '<ion-view view-title="{{getTitle()}}">'
                      +'<ion-content>'
                      +'<div ng-include src="\'templates/pages/about.html\'"></div>'
                      +'</ion-content>'
                      +'</ion-view>'
                    ,
                    controller: 'aboutCtrl'
                }
            }
        });
        // View - byauthor
        $stateProvider.state('app.byauthor', {
            url: '/byauthor',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pages/byauthor.html',
                    controller: 'byauthorCtrl'
                }
            }
        });
        // View - byauthor
        $stateProvider.state('app.byauthor1', {
            url: '/byauthor/:key1',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pages/byauthor.html',
                    controller: 'byauthorCtrl1'
                }
            }
        });
        // View - bydate
        $stateProvider.state('app.bydate', {
            url: '/bydate',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pages/bydate.html',
                    controller: 'bydateCtrl'
                }
            }
        });
        // View - bystate
        $stateProvider.state('app.bystate', {
            url: '/bystate',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pages/bystate.html',
                    controller: 'bystateCtrl'
                }
            }
        });
        // View - bystate
        $stateProvider.state('app.bystate1', {
            url: '/bystate/:key1',
            views: {
                'menuContent': {
                    templateUrl: 'templates/pages/bystate.html',
                    controller: 'bystateCtrl1'
                }
            }
        });
        // Form - detailcontact
        $stateProvider.state('app.detailcontact', {
            url: '/detailcontact/:id',
            // This allows the parameter to be optional without a trailing slash
            params: {
                id: {squash:true, value:null}
            },
            views: {
                'menuContent': {
                    template:
                       '<ion-view view-title="{{getTitle()}}">'
                      +'<ion-content>'
                      +'<div ng-include src="\'templates/pages/detailcontact.html\'"></div>'
                      +'</ion-content>'
                      +'</ion-view>'
                    ,
                    controller: 'detailcontactCtrl'
                }
            }
        });
        // Form - editcontact
        $stateProvider.state('app.editcontact', {
            url: '/editcontact/:id',
            // This allows the parameter to be optional without a trailing slash
            params: {
                id: {squash:true, value:null}
            },
            views: {
                'menuContent': {
                    template:
                       '<ion-view view-title="{{getTitle()}}">'
                      +'<ion-nav-buttons side="right">'
                      +'<button class="button button-icon button-clear ion-android-send" ng-click="submit()"></button>'
                      +'</ion-nav-buttons>'
                      +'<ion-content>'
                      +'<div ng-include src="\'templates/pages/editcontact.html\'"></div>'
                      +'</ion-content>'
                      +'</ion-view>'
                    ,
                    controller: 'editcontactCtrl'
                }
            }
        });
        // Form - home
        $stateProvider.state('app.home', {
            url: '/home',
            // This allows the parameter to be optional without a trailing slash
            params: {
                id: {squash:true, value:null}
            },
            views: {
                'menuContent': {
                    template:
                       '<ion-view view-title="{{getTitle()}}">'
                      +'<ion-content>'
                      +'<div ng-include src="\'templates/pages/home.html\'"></div>'
                      +'</ion-content>'
                      +'</ion-view>'
                    ,
                    controller: 'homeCtrl'
                }
            }
        });
        $urlRouterProvider.otherwise('/app/bydate');
    }]);


    module.run(['$rootScope','$window','$state','$ionicHistory','func',function($rootScope,$window,$state,$ionicHistory,func) {
    	// Make the data models globally available so the navigator can access them
    	// Could also be provided as a service to avoid the pollution of $rooScope
    	// Use an object because of prototypical inheritance
    	// http://stackoverflow.com/questions/15305900/angularjs-ng-model-input-type-number-to-rootscope-not-updating
    	$rootScope.options = {
    		ready: false,
    		debugPlugin: false
    	}
    	
    	// Make Darwino a globally accessible
    	$rootScope.darwino = darwino;
    	
    	// Make the script function available to the Ng Expressions
    	$rootScope.func = func;
    	
    	// Multi pane handling
    	// The application is dual pane if the screen is large enough, here 768pc
    	$rootScope.isDualPane = function() {
    		if($window.matchMedia("(min-width:768px)").matches) {
    			return true;
    		}
    		return false
    	}	

    	// Handle authentication error 
    	$rootScope.$on('dwo-unauthorized', function() {
    		// By default, we reload the page which should trigger the proper authentication
    		// This can be overridden with custom code, as it depends on the authenticator being used
        	//window.location.reload(); 
        });

    	// Check the current state
    	// Used by the navigator to highlight the current selection
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
    	
    	// Helper to change the state
    	$rootScope.go = function(path,monoPaneOnly) {
    		if(monoPaneOnly) {
    			if($rootScope.isDualPane()) {
    				return;
    			}
    		}
    		$state.go(path);
    	};
    	$rootScope.submit = function() {
    	}
    	$rootScope.cancel = function() {
    	}
    	$rootScope.back = function() {
    		$ionicHistory.goBack();
    	}
    }]);


    //
    // Base controller for a View
    //
    module.controller('AbstractViewCtrl', ['$scope', '$state', '$ionicPopup', 'notifyDataChange', 'session', function($scope,$state,$ionicPopup,notifyDataChange,session) {
    	$scope.entries = function entries() {
    		return $scope.itemList.getEntries()
    	}

    	// Reload the data from the view when it is entered
    	// This ensures that it displays the lastets data
    	// For performance reasons, we only do that after the an edit has been done to the data
    	$scope.$on("$ionicView.beforeEnter", function(event, data){
    		$scope.reload(0,true);
    	});	

    	$scope.hasMore = function hasMore() {
    		return $scope.itemList.hasMore()
    	}

    	$scope.loadMore = function loadMore() {
    		function broadcast() {
    			$scope.$broadcast('scroll.infiniteScrollComplete');
    		    notifyDataChange();
    		}
    		$scope.itemList.loadMore(broadcast,broadcast);
    	}

    	$scope.reload = function reload(delay,keepSelection) {
    		var selection = keepSelection ? $scope.itemList.selectedItem : null; 
    		function broadcast() {
    			darwino.hybrid.setDirty(false);
    			$scope.$broadcast('scroll.refreshComplete');
    			if(selection) $scope.selectEntry(selection);
    		}
    		$scope.itemList.reload(delay,broadcast,broadcast);
    	}
    	
    	
    	//
    	// Check the security to enable/disable actions
    	//
    	$scope.canCreateDocument = function() {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canCreateDocument();
    	}
    	$scope.canUpdateDocument = function(data) {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canUpdateDocument() && (!data || !data.readOnly);
    	}
    	$scope.canDeleteDocument = function(data) {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canDeleteDocument() && (!data || !data.readOnly);
    	}
    	
    	//
    	// Actions on elements
    	//
    	$scope.createDocument = function(page) {
    		$state.go(page,{id:null});
    	}
    	$scope.createResponse = function(page,data) {
    		$state.go(page,{parentid:data.unid});
    	}
    	$scope.editDocument = function(page,data) {
    		$state.go(page,{id:data.unid});
    	}
    	$scope.deleteDocument = function(data) {
    		if(!data) return;
    		$ionicPopup.confirm({
    			title: 'Delete Document',
    			template: 'Are you sure you want to delete this document?'
    		}).then(function(res) {
    			if(res) {
    				$scope.itemList.deleteItem(data);
    			}
    		});	
    	}
    	
    	//
    	// FT Search
    	//
    	$scope.ftSearchActivated = false;
    	$scope.ftSearch = '';
    	$scope.isFtSearchEnabled = function() {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.isFtSearchEnabled();
    	}
    	$scope.startFtSearch = function() {
    		$scope.ftSearchActivated = true;
    	}
    	$scope.cancelFtSearch = function() {
    		$scope.ftSearchActivated = false;
    		var reload = $scope.itemList.ftSearch!=null
    		$scope.itemList.ftSearch = null;
    		if(reload) {
    			$scope.reload();
    		}
    	}
    	
    	//
    	// Access to the current entry
    	//
    	$scope.currentEntry = function() {
    		return $scope.itemList.selectedItem;
    	}
    	$scope.selectEntry  = function selectEntry(entry) {
    		$scope.itemList.selectItem(entry);
    	}
    }]);


    //
    // Base controller for a Document form
    //
    module.controller('AbstractFormDocCtrl', ['$scope', 'session', '$ionicPopup', '$ionicHistory', function($scope,session,$ionicPopup,$ionicHistory) {
    	//
    	// Check the security to enable/disable actions
    	//
    	$scope.canCreateDocument = function() {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canCreateDocument();
    	}
    	$scope.canUpdateDocument = function(data) {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canUpdateDocument() && (!data || !data.readOnly);
    	}
    	$scope.canDeleteDocument = function(data) {
    		var db = session.getLoadedDatabase($scope.database);
    		return db && db.canDeleteDocument() && (!data || !data.readOnly);
    	}
    	
    	//
    	// Actions on elements
    	//
    	$scope.createResponse = function(page,data) {
    		$state.go(page,{parentid:data.unid});
    	}
    	$scope.editDocument = function(page,data) {
    		$state.go(page,{id:data.unid});
    	}
    	$scope.deleteDocument = function(data) {
    		if(!data) return;
    		$ionicPopup.confirm({
    			title: 'Delete Document',
    			template: 'Are you sure you want to delete this document?'
    		}).then(function(res) {
    			if(res) {
    				data.deleteDocument();
    				$ionicHistory.goBack();
    			}
    		});	
    	}
    }]);
    //
    //	Main controller for the whole application
    //
    module.controller('AppCtrl', ['$scope','$http','userService', function($scope,$http,userService) {
    	//
    	// Information service used by the about page to get information on the current application
    	//
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
    	
    	//
    	// Access to the user service
    	//
    	$scope.userService = userService;
    }]);

    module.controller('aboutCtrl', ['$scope', function($scope) {

    }]);

    module.controller('detailcontactCtrl', ['session','notifyDataChange','$controller','$scope', '$state','$stateParams','$ionicHistory', function(session,notifyDataChange,$controller,$scope,$state,$stateParams,$ionicHistory) {
    	// Inherit from a base View controller
    	$controller('AbstractFormDocCtrl', {$scope: $scope});

    	var id = $stateParams.id;

    	$scope.data = null;
    	$scope.value = null;
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 

    	session.getDatabase($scope.database).then(function(db) {
    		var store = db.getStore($scope.store); 
    		if(id) {
    			return store.loadDocument(id);
    		} else {
    			return store.newDocument();
    		}
    	}).then(function (doc) {
    		var pid = $state.params.parentid; 
    		if(pid) {
    			doc.setParentUnid(pid);
    		}
    		doc.convertAttachmentUrlsForDisplay();
    		$scope.data = doc;
    		$scope.data.value = $scope.value = doc.json;
    		$scope.apply();
    	});
    	
    	$scope.submit = function() {
    		var doc = $scope.data;
    		if(doc) {
    			doc.convertAttachmentUrlsForStorage();
    			var isNew = doc.isNewDocument();
    			doc.save().then(function() {
    				doc.convertAttachmentUrlsForDisplay();
    				$ionicHistory.goBack();
    			})
    		}
    	}

    	$scope.cancel = function() {
    		$ionicHistory.goBack();
    	}
    	
    	$scope.getTitle = function() {
    		var doc = $scope.data;
    		return !doc || doc.isNewDocument() ? "New Document" : "Edit Document";
    	}

    }])
    module.controller('editcontactCtrl', ['session','notifyDataChange','$controller','$scope', '$state','$stateParams','$ionicHistory', function(session,notifyDataChange,$controller,$scope,$state,$stateParams,$ionicHistory) {
    	// Inherit from a base View controller
    	$controller('AbstractFormDocCtrl', {$scope: $scope});

    	var id = $stateParams.id;

    	$scope.data = null;
    	$scope.value = null;
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 

    	session.getDatabase($scope.database).then(function(db) {
    		var store = db.getStore($scope.store); 
    		if(id) {
    			return store.loadDocument(id);
    		} else {
    			return store.newDocument();
    		}
    	}).then(function (doc) {
    		var pid = $state.params.parentid; 
    		if(pid) {
    			doc.setParentUnid(pid);
    		}
    		doc.convertAttachmentUrlsForDisplay();
    		$scope.data = doc;
    		$scope.data.value = $scope.value = doc.json;
    		$scope.apply();
    	});
    	
    	$scope.submit = function() {
    		var doc = $scope.data;
    		if(doc) {
    			doc.convertAttachmentUrlsForStorage();
    			var isNew = doc.isNewDocument();
    			doc.save().then(function() {
    				doc.convertAttachmentUrlsForDisplay();
    				$ionicHistory.goBack();
    			})
    		}
    	}

    	$scope.cancel = function() {
    		$ionicHistory.goBack();
    	}
    	
    	$scope.getTitle = function() {
    		var doc = $scope.data;
    		return !doc || doc.isNewDocument() ? "New Document" : "Edit Document";
    	}

    }])
    module.controller('homeCtrl', ['$scope', function($scope) {

    }]);

    //
    // This controller is used by the view to display the list of entries
    //
    module.controller('byauthorCtrl', ['$controller','$scope','$state','$jstore','session', function($controller,$scope,$state,$jstore,session) {
    	// Inherit from a base View controller
    	$controller('AbstractViewCtrl', {$scope: $scope});
    	
    	// Set the pages to display
    	$scope.listTemplate = 'templates/byauthor_list.html'; 
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 
    	
    	var itemList = $scope.itemList = $jstore.createItemList(session);
    	
    	var Cursor = darwino.jstore.Cursor;
    	var p = {
    		database: $scope.database,
    		store: $scope.store,
    		orderBy: "_cuser , firstname, lastname",
    		aggregate: "{ Count: {$count: \'$\'} }",
    		categoryStart: 0,
    		categoryCount: 1,
    		options: Cursor.RANGE_ROOT|Cursor.DATA_CATONLY
    	};
    	itemList.initCursor(p);

    	//
    	// Calculate the count
    	//
    	$scope.entryCount = function() {
    		return $scope.itemList.entryCount();
    	}
    	
    	//
    	// Event
    	//
    	$scope.onEntryClick = function(entry) {
    		$scope.selectEntry(entry);
    		if(!entry) return;
    		var keys = angular.isArray(entry.key) ? entry.key : [entry.key];
    		var params = {
    			'key1': keys[0]
    		};
    		$state.go('app.byauthor1',params,{reload:true});
    		return;
    	}	
    }]);

    //
    // This controller is used by the view to display the list of entries
    //
    module.controller('byauthorCtrl1', ['$controller','$scope','$state','$jstore','session', function($controller,$scope,$state,$jstore,session) {
    	// Inherit from a base View controller
    	$controller('AbstractViewCtrl', {$scope: $scope});
    	
    	// Set the pages to display
    	$scope.listTemplate = 'templates/byauthor_list1.html'; 
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 
    	
    	var itemList = $scope.itemList = $jstore.createItemList(session);
    	
    	var Cursor = darwino.jstore.Cursor;
    	var p = {
    		database: $scope.database,
    		store: $scope.store,
    		orderBy: "_cuser , firstname, lastname",
    		options: Cursor.RANGE_ROOT+Cursor.DATA_MODDATES+Cursor.DATA_READMARK+Cursor.DATA_WRITEACC
    	};

    	var qcat = {
    		'_cuser':  $state.params["key1"]
    	};
    	p.query = JSON.stringify(qcat);
    	p.parentId='*';
    	itemList.initCursor(p);

    	//
    	// Calculate the count
    	//
    	$scope.entryCount = function() {
    		return $scope.itemList.entryCount();
    	}

    	//
    	// Event
    	//
    	$scope.onEntryClick = function(entry) {
    		$scope.selectEntry(entry);
    		if(!entry) return;
    		// There is a detail page, so we navigate to to the edit page if we are not dual pane
    		if(!$scope.isDualPane()) {
    			$state.go('app.editcontact',{id:entry.unid},{reload:true});
    		}
    	}	
    }]);


    //
    // This controller is used by the page used to display the item details
    //
    module.controller('byauthorCtrl_detail', ['$scope', function($scope) {
    	$scope.$watch('itemList.selectedItem', function() {
    		$scope.data = $scope.itemList.selectedItem;
    	});
    }]);

    //
    // This controller is used by the view to display the list of entries
    //
    module.controller('bydateCtrl', ['$controller','$scope','$state','$jstore','session', function($controller,$scope,$state,$jstore,session) {
    	// Inherit from a base View controller
    	$controller('AbstractViewCtrl', {$scope: $scope});
    	
    	// Set the pages to display
    	$scope.listTemplate = 'templates/bydate_list.html'; 
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 
    	
    	var itemList = $scope.itemList = $jstore.createItemList(session);
    	
    	var Cursor = darwino.jstore.Cursor;
    	var p = {
    		database: $scope.database,
    		store: $scope.store,
    		orderBy: "_cdate desc",
    		options: Cursor.RANGE_ROOT+Cursor.DATA_MODDATES+Cursor.DATA_READMARK+Cursor.DATA_WRITEACC
    	};

    	itemList.initCursor(p);

    	//
    	// Calculate the count
    	//
    	$scope.entryCount = function() {
    		return $scope.itemList.entryCount();
    	}

    	//
    	// Event
    	//
    	$scope.onEntryClick = function(entry) {
    		$scope.selectEntry(entry);
    		if(!entry) return;
    		// There is a detail page, so we navigate to to the edit page if we are not dual pane
    		if(!$scope.isDualPane()) {
    			$state.go('app.editcontact',{id:entry.unid},{reload:true});
    		}
    	}	
    }]);


    //
    // This controller is used by the page used to display the item details
    //
    module.controller('bydateCtrl_detail', ['$scope', function($scope) {
    	$scope.$watch('itemList.selectedItem', function() {
    		$scope.data = $scope.itemList.selectedItem;
    	});
    }]);

    //
    // This controller is used by the view to display the list of entries
    //
    module.controller('bystateCtrl', ['$controller','$scope','$state','$jstore','session', function($controller,$scope,$state,$jstore,session) {
    	// Inherit from a base View controller
    	$controller('AbstractViewCtrl', {$scope: $scope});
    	
    	// Set the pages to display
    	$scope.listTemplate = 'templates/bystate_list.html'; 
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 
    	
    	var itemList = $scope.itemList = $jstore.createItemList(session);
    	
    	var Cursor = darwino.jstore.Cursor;
    	var p = {
    		database: $scope.database,
    		store: $scope.store,
    		orderBy: "state , firstname, lastname",
    		aggregate: "{ Count: {$count: \'$\'} }",
    		categoryStart: 0,
    		categoryCount: 1,
    		options: Cursor.RANGE_ROOT|Cursor.DATA_CATONLY
    	};
    	itemList.initCursor(p);

    	//
    	// Calculate the count
    	//
    	$scope.entryCount = function() {
    		return $scope.itemList.entryCount();
    	}
    	
    	//
    	// Event
    	//
    	$scope.onEntryClick = function(entry) {
    		$scope.selectEntry(entry);
    		if(!entry) return;
    		var keys = angular.isArray(entry.key) ? entry.key : [entry.key];
    		var params = {
    			'key1': keys[0]
    		};
    		$state.go('app.bystate1',params,{reload:true});
    		return;
    	}	
    }]);

    //
    // This controller is used by the view to display the list of entries
    //
    module.controller('bystateCtrl1', ['$controller','$scope','$state','$jstore','session', function($controller,$scope,$state,$jstore,session) {
    	// Inherit from a base View controller
    	$controller('AbstractViewCtrl', {$scope: $scope});
    	
    	// Set the pages to display
    	$scope.listTemplate = 'templates/bystate_list1.html'; 
    	$scope.database = 'contacts'; 
    	$scope.store = '_default'; 
    	
    	var itemList = $scope.itemList = $jstore.createItemList(session);
    	
    	var Cursor = darwino.jstore.Cursor;
    	var p = {
    		database: $scope.database,
    		store: $scope.store,
    		orderBy: "state , firstname, lastname",
    		options: Cursor.RANGE_ROOT+Cursor.DATA_MODDATES+Cursor.DATA_READMARK+Cursor.DATA_WRITEACC
    	};

    	var qcat = {
    		'state':  $state.params["key1"]
    	};
    	p.query = JSON.stringify(qcat);
    	p.parentId='*';
    	itemList.initCursor(p);

    	//
    	// Calculate the count
    	//
    	$scope.entryCount = function() {
    		return $scope.itemList.entryCount();
    	}

    	//
    	// Event
    	//
    	$scope.onEntryClick = function(entry) {
    		$scope.selectEntry(entry);
    		if(!entry) return;
    		// There is no detail page, so we navigate to to the edit page
    		$state.go('app.editcontact',{id:entry.unid},{reload:true});
    	}	
    }]);



})();
