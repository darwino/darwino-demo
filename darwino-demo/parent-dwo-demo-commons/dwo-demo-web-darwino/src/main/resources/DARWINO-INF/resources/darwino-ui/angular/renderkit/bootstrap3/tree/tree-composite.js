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

/**
 * Bootstrap Renderkit
 */

(function(angular) {
	
	angular.module("darwino")
		.service("dwoTreeCompositeRenderer", ['darwino','dwoTreeRenderer','dwoTreeListRenderer',function(darwino,dwoTreeRenderer,dwoTreeListRenderer) {
			return {
				// Give it a chance to get initialized
				initScope: function(scope) {
					dwoTreeRenderer.initScope(scope); var treeTemplate = scope.nodeTemplate;
					dwoTreeListRenderer.initScope(scope); var listTemplate = scope.nodeTemplate;
					
    				scope.nodeTemplate = function() {
    					if(this.getLevel()==0) {
    						return listTemplate.call(this);
    					} else {
    						return treeTemplate.call(this);
    					}
    				};
    				
    				scope.li
				}
			};
	}]);
	
})(angular);
