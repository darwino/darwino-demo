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

var jstore_baseUrl = "$darwino-jstore";
var social_baseUrl = "$darwino-social";

var session = jstore.createRemoteApplication(jstore_baseUrl).createSession();
var profilesService = social.createProfilesService(social_baseUrl+"/profiles");

// Enable some logging
var LOG_GROUP = "discdb.web";
darwino.log.enable(LOG_GROUP,darwino.log.DEBUG)

angular.module('discDb', [ 'ngSanitize','ionic' ])

.run(function($rootScope,$location) {
	// Make some global var visible
	$rootScope.darwino = darwino;
	$rootScope.session = session;
	$rootScope.profilesService = profilesService;
	
	$rootScope.menuDisc = true;
	$rootScope.menuSync = true;
	$rootScope.menuSettings = true;
	$rootScope.toggleMenu = function(menu) {
		$rootScope[menu] = !$rootScope[menu]; 
	}

	$rootScope._entriesCount = -1;
	$rootScope.getEntriesCount = function() {
		if($rootScope._entriesCount<0) {
			var store = session.getDatabase("domdisc").getStore("nsfdata");
			$rootScope._entriesCount = store.documentCount();
			darwino.log.d(LOG_GROUP,"Calculated discussion entries count {0}",$rootScope._entriesCount);
		}
		return $rootScope._entriesCount; 
	};

	$rootScope.isAnonymous = function() {
		return profilesService.isAnonymous();
	};
	$rootScope.isReadOnly = function() {
		return profilesService.isAnonymous();
	};
	$rootScope.go = function(path) {
		$location.path(path);
	};
	
	darwino.hybrid.addSettingsListener(function(){
		$rootScope.$apply()
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
	});

	$urlRouterProvider.otherwise("/disc/bydate");
})

.controller('MainCtrl', function($scope) {
})


//
//	By Date
//
.controller('ByDateCtrl', ['$scope','$rootScope','$http','$ionicModal', function($scope,$rootScope,$http,$ionicModal) {
	$scope.refresh = function() {
		$scope.entries.refresh();
	};

	$scope.hasMore = function() {
		return $scope.entries.hasMore();
	};

	$scope.loadMore = function() {
		$scope.entries.loadMore();
	};
	
	$ionicModal.fromTemplateUrl('templates/discdb-post.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(postModal) {
		$scope.postModal = postModal;
	});
	
	$ionicModal.fromTemplateUrl('templates/discdb-comment.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(commentModal) {
		$scope.commentModal = commentModal;
	});

	var itemCount = 10; // Number of items requested by request
	var entries = {
		all: [],
		eof: false,
		mode: 0,		// 0: status, 1: edit item, 2: edit comment, 3: new comment
		currentItemId: null,
		currentCommentId: null,
		currentTitle: "",
		currentText: "",
		getProfile: function(item) {
			return profilesService.getProfile(item.value.from,function(){$scope.$apply()});
		},
		getPhoto: function(item) {
			return profilesService.getProfilePhotoUrl(item.value.from);
		},
		isEditItem: function(item) {
			return this.mode==1 && item==this.currentItem;
		},
		isEditComment: function(comment) {
			return this.mode==2 && comment==this.currentComment;
		},
		isNewComment: function(item) {
			return this.mode==3 && item==this.currentItem;
		},
		refresh: function() {
			this.loadItems(0,itemCount);
			darwino.hybrid.setDirty(false);
		},
		hasMore: function() {
			return !this.eof;
		},
		loadMore: function() {
			this.loadItems(entries.all.length,itemCount);
		},
		loadItems: function(skip,limit) {
			if(skip==0) {
				this.eof = false;
				entries.all = [];
			}
			// Prevents loop with infinite scroll
			if(this.eof) {
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return;
			}
			var wallURL = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?skip='+skip
					+'&limit='+limit
					+'&hierarchical=2'
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES);
			this._loadItems(wallURL,function(entry) {
				entries.all.push(entry);
			},true);
		},
		loadOneItem: function(unid) {
			var wallURL = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?unid='+unid
					+'&hierarchical=2'
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES);
			this._loadItems(wallURL,function(entry) {
				entries.all.unshift(entry);
			},true);
		},
		toggleComments: function(item) {
			item.showComments = !item.showComments;
		},
		reloadItem: function(item,showComments) {
			var wallURL = jstore_baseUrl+'/databases/domdisc/stores/nsfdata/entries'
					+'?unid='+item.unid
					+'&hierarchical=2'
					+'&orderby=_cdate desc'
					+'&jsontree=true'
					+'&options='+(jstore.Cursor.RANGE_ROOT+jstore.Cursor.DATA_MODDATES);
			this._loadItems(wallURL,function(entry) {
				for(var i=0; i<entries.all.length; i++) {
					darwino.log.d(LOG_GROUP,"Check DiscDB entry="+entries.all[i].unid+", "+entry.unid);
					if(entries.all[i].unid==entry.unid) {
						entry.showComments = showComments;
						entries.all[i] = entry;
						break;
					}
				}
			});
		},
		_loadItems: function(wallURL,cb,event) {
			function absoluteURL(url) {
				var a = document.createElement('a');
				a.href = url;
				return a.href;
			}
			wallURL = absoluteURL(wallURL); 
			var successCallback = function(data, status, headers, config) {
				if(data.length==0) {
					entries.eof = true;
				} else {
					for(var i=0; i<data.length; i++) {
						var entry = data[i];
						cb(entry);
					}
					$rootScope._wallCount = -1;
				}
				if(event) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');
				}
				darwino.log.d(LOG_GROUP,'Entries loaded from server: '+wallURL+', #', entries.all.length);
			};
			$http.get(wallURL).success(successCallback);
		},
		allCount: function() {
			return entries.all.length;
		},
		
		newPost: function(item) {
			this.mode = 1;
			this.currentTitle = "";
			this.currentText = "";
			$scope.postModal.show();
		},
		editPost: function(item) {
			this.mode = 2;
			this.currentItem = item;
			this.currentTitle = item.value.subject;
			this.currentText = item.value.body;
			$scope.postModal.show();
		},
		deletePost: function(item) {
			var store = session.getDatabase("domdisc").getStore("nsfdata");
			var del = store.deleteDocument(item.unid);
			// Should check the # of deletion when available
			//if(del) {
				var idx = entries.all.indexOf(item);
				if(idx>=0) {
					entries.all.splice(idx,1);
				}
			//}
			this.cancel();
		},
		
		newComment: function(item) {
			this.mode = 3;
			this.currentItem = item;
			this.currentTitle = "";
			this.currentText = "";
			$scope.commentModal.show();
		},
		editComment: function(item,comment) {
			this.mode = 4;
			this.currentItem = item;
			this.currentComment = comment;
			this.currentTitle = comment.value.subject;
			this.currentText = comment.value.body;
			$scope.commentModal.show();
		},
		deleteComment: function(item,comment) {
			var store = session.getDatabase("domdisc").getStore("nsfdata");
			var del = store.deleteDocument(comment.unid);
			// Should check the # of deletion when available
			//if(del) {
				var idx = item.children.indexOf(comment);
				if(idx>=0) {
					item.children.splice(idx,1);
				}
			//}
			this.cancel();
		},
		
		submit: function() {
			switch(this.mode) {
				case 1: { // New item
					if(this.currentText) {
						var store = session.getDatabase("domdisc").getStore("nsfdata");
						var doc = store.newDocument();
						var json = {
							"subject": this.currentTitle,
							"body":	this.currentText
						};
						doc.setJson(json);
						doc.save();
						this.loadOneItem(doc.getUnid());
						this.cancel();
					}
				} break;
				case 2: { // Edit item
					if(this.currentItem && this.currentText) {
						var store = session.getDatabase("domdisc").getStore("nsfdata");
						var doc = store.loadDocument(this.currentItem.unid);
						if(doc!=null) {
							doc.getJson().subject = this.currentTitle; 
							doc.getJson().body = this.currentText; 
							doc.save();
							this.reloadItem(this.currentItem,this.currentItem.showComments);
						}
						this.cancel();
					}
				} break;
				case 3: { // New comment
					if(this.currentItem && this.currentText) {
						var store = session.getDatabase("domdisc").getStore("nsfdata");
						var doc = store.newDocument();
						var json = {
							"subject":	this.currentTitle,
							"body":	this.currentText
						};
						doc.setJson(json);
						doc.setParentUnid(this.currentItem.unid);
						doc.save();
						this.reloadItem(this.currentItem,true);
						this.cancel();
					}
				} break;
				case 4: { // Edit comment
					if(this.currentItem && this.currentText) {
						var store = session.getDatabase("domdisc").getStore("nsfdata");
						var doc = store.loadDocument(this.currentComment.unid);
						if(doc!=null) {
							doc.getJson().subject = this.currentTitle; 
							doc.getJson().body = this.currentText; 
							doc.save();
							this.reloadItem(this.currentItem,true);
						}
						this.cancel();
					}
				} break;
			}
		},
		cancel: function() {
			switch(this.mode) {
				case 1:
				case 2:
					$scope.postModal.hide();
				break;
				case 3:
				case 4:
					$scope.commentModal.hide();
				break;

			}
			this.mode = 0;
		}
	};

	$scope.entries = entries;
}])


//
//	Profile
//
.controller('ProfileCtrl', function($scope) {
});
