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

var wReader = angular.module('wReader', ['ngTouch', 'wReader.filters', 'wReader.services', 'wReader.directives']);

wReader.config(function($httpProvider) {
	//Enable cross domain calls
	//$httpProvider.defaults.useXDomain = true;
});
  
wReader.controller('AppController', function ($scope, items, scroll) {

	$scope.items = items;

	$scope.refresh = function() {
		items.getItemsFromServer();
	};

	$scope.loadMore = function() {
		items.getItemsFromServer();
	};

	$scope.keyPress = function(ev) {
		if(ev.which==13) {
			items.getItemsFromServer();
		}
	};

	$scope.handleSpace = function() {
		if (!scroll.pageDown()) {
			items.next();
		}
	};

	$scope.$watch('items.selectedIdx', function(newVal, oldVal, scope) {
		if (newVal !== null) scroll.toCurrent();
	});

	$scope.isHybrid = function() {
		return darwino.hybrid.isHybrid();
	};

	$scope.getMode = function() {
		return darwino.hybrid.getMode();
	};
});


// Top Menu/Nav Bar
wReader.controller('NavBarController', function ($scope, items) {

	$scope.showAll = function() {
		items.clearFilter();
	};

	$scope.showUnread = function() {
		items.filterBy('read', false);
	};

	$scope.showRead = function() {
		items.filterBy('read', true);
	};
});

document.addEventListener('DOMContentLoaded', function(e) {
	//On mobile devices, hide the address bar
	window.scrollTo(0,0);
}, false);
