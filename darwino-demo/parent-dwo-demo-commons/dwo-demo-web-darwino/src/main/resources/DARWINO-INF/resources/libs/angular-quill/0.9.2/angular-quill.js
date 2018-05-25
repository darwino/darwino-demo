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

(function () {
  'use strict';

  /**
   * usage: <div ng-model="article.body" quill="{
      theme: 'mytheme'
    }"></div>
   *
   *    extra options:
   *      quill: pass as a string
   *
   */

  var scripts = document.getElementsByTagName("script"),
      currentScriptPath = scripts[scripts.length-1].src;

  angular.module('angular-quill', [])
    .directive("quill", ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        require: "ngModel",
        replace: true,
        templateUrl: currentScriptPath.replace('.js', '.html'),
        controller: function () {

        },
        link: function (scope, element, attrs, ngModel) {

          var updateModel = function updateModel(value) {
              scope.$apply(function () {
                ngModel.$setViewValue(value);
              });
            },
            options = {
              modules: {
                'toolbar': { container: '.toolbar' },
                'image-tooltip': true,
                'link-tooltip': true
              },
              theme: 'snow'
            },
            extraOptions = attrs.quill ?
                                scope.$eval(attrs.quill) : {},
            editor;

          angular.extend(options, extraOptions);
          
          $timeout(function () {

            editor = new Quill(element.children()[1], options);

            ngModel.$render();

            editor.on('text-change', function(delta, source) {
              updateModel(this.getHTML());
            });

            editor.once('selection-change', function(hasFocus) {
//              $(editor).toggleClass('focus', hasFocus);
            	if(hasFocus && !/\bhasFocus\b/.test(editor.root.className)) {
            		editor.root.className += " hasFocus";
            	} else {
            		editor.root.className = editor.root.className.replace(/\bhasFocus\b/, "");
            	}
              // Hack for inability to scroll on mobile
              if (/mobile/i.test(navigator.userAgent)) {
//                $(editor).css('height', quill.root.scrollHeight + 30)   // 30 for padding
            	  editor.root.style.height = (quill.root.scrollHeight + 30) + "px";
              }
            });

          });


          ngModel.$render = function () {
            if (angular.isDefined(editor)) {
              $timeout(function() {
                editor.setHTML(ngModel.$viewValue || '');
              });
            }

          };

        }
      };
    }]);
})();

