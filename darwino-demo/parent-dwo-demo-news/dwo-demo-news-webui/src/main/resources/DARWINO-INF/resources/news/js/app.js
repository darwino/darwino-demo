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
