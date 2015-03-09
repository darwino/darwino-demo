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

var directives = angular.module('wReader.directives', []);


directives.directive('wUp', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      switch (e.keyCode) {
        case 34: // PgDn
        case 39: // right arrow
        case 40: // down arrow
        case 74: // j
          return scope.$apply(attr.wDown);

        case 32: // Space
          e.preventDefault();
          return scope.$apply(attr.wSpace);

        case 33: // PgUp
        case 37: // left arrow
        case 38: // up arrow
        case 75: // k
          return scope.$apply(attr.wUp);

        case 85: // U
          return scope.$apply(attr.wRead);
      }
    });
  };
});
