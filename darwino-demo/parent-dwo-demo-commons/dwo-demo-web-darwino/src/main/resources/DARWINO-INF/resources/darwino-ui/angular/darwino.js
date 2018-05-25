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

/**
 * Main module creation.
 * This must be the first file loaded in the page
 */
(function(angular) {
	
	angular.module("darwino", [])
		.service("darwino", function() {
			var nativeFilter = Array.prototype.filter;

        	function concat(c,sep) {
        		// Cannot use join() because of possible empty array values
        		// forEach() is not yet available on all browsers (ex: IE8)
        		var s = "";
        		for(var i=0; i<c.length; i++) {
        			if(c[i]) {
        				if(s) s += sep + c[i]; else s = c[i];
        			}
    			}
        		return s;
        	}
			
			return {
				// Get the version of Darwino
				version: function() { 
					return "1.0.0"; 
				},
				
				// String utilities
				trim: (function() {
					  if (!String.prototype.trim) {
					    return function(value) {
					      return value.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					    };
					  }
					  return function(value) {
					    return value.toString().trim();
					  };
				})(),
				
				// Style and class handling
            	concatClasses: function(c) {
            		return concat(arguments," ");
            	},
            	concatStyles: function(s) {
            		return concat(arguments,";");
            	},
            	addClass: function(cssClass, addClassProperty) {
            		if (cssClass) {
            			if (addClassProperty)
            				return 'class="' + cssClass + '"';
            			else
            				return cssClass;
            		}
            		else
            			return "";
            	},
				
				// Set a default value for a property, if not already defined
            	setDefaultProperty: function(obj, prop, value) {
	                if (!obj.hasOwnProperty(prop)) {
	                    obj[prop] = value;
	                }
	            }
			};
	});
	
}(angular));
