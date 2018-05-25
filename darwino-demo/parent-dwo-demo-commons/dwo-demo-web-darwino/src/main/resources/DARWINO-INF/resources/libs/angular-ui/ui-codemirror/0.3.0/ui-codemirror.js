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

'use strict';

/**
 * Binds a CodeMirror widget to a <textarea> element.
 */
angular.module('ui.codemirror', [])
  .constant('uiCodemirrorConfig', {})
  .directive('uiCodemirror', uiCodemirrorDirective);

/**
 * @ngInject
 */
function uiCodemirrorDirective($timeout, uiCodemirrorConfig) {

  return {
    restrict: 'EA',
    require: '?ngModel',
    compile: function compile() {

      // Require CodeMirror
      if (angular.isUndefined(window.CodeMirror)) {
        throw new Error('ui-codemirror needs CodeMirror to work... (o rly?)');
      }

      return postLink;
    }
  };

  function postLink(scope, iElement, iAttrs, ngModel) {

    var codemirrorOptions = angular.extend(
      { value: iElement.text() },
      uiCodemirrorConfig.codemirror || {},
      scope.$eval(iAttrs.uiCodemirror),
      scope.$eval(iAttrs.uiCodemirrorOpts)
    );

    var codemirror = newCodemirrorEditor(iElement, codemirrorOptions);

    configOptionsWatcher(
      codemirror,
      iAttrs.uiCodemirror || iAttrs.uiCodemirrorOpts,
      scope
    );

    configNgModelLink(codemirror, ngModel, scope);

    configUiRefreshAttribute(codemirror, iAttrs.uiRefresh, scope);

    // Allow access to the CodeMirror instance through a broadcasted event
    // eg: $broadcast('CodeMirror', function(cm){...});
    scope.$on('CodeMirror', function(event, callback) {
      if (angular.isFunction(callback)) {
        callback(codemirror);
      } else {
        throw new Error('the CodeMirror event requires a callback function');
      }
    });

    // onLoad callback
    if (angular.isFunction(codemirrorOptions.onLoad)) {
      codemirrorOptions.onLoad(codemirror);
    }
  }

  function newCodemirrorEditor(iElement, codemirrorOptions) {
    var codemirrot;

    if (iElement[0].tagName === 'TEXTAREA') {
      // Might bug but still ...
      codemirrot = window.CodeMirror.fromTextArea(iElement[0], codemirrorOptions);
    } else {
      iElement.html('');
      codemirrot = new window.CodeMirror(function(cm_el) {
        iElement.append(cm_el);
      }, codemirrorOptions);
    }

    return codemirrot;
  }

  function configOptionsWatcher(codemirrot, uiCodemirrorAttr, scope) {
    if (!uiCodemirrorAttr) { return; }

    var codemirrorDefaultsKeys = Object.keys(window.CodeMirror.defaults);
    scope.$watch(uiCodemirrorAttr, updateOptions, true);
    function updateOptions(newValues, oldValue) {
      if (!angular.isObject(newValues)) { return; }
      codemirrorDefaultsKeys.forEach(function(key) {
        if (newValues.hasOwnProperty(key)) {

          if (oldValue && newValues[key] === oldValue[key]) {
            return;
          }

          codemirrot.setOption(key, newValues[key]);
        }
      });
    }
  }

  function configNgModelLink(codemirror, ngModel, scope) {
    if (!ngModel) { return; }
    // CodeMirror expects a string, so make sure it gets one.
    // This does not change the model.
    ngModel.$formatters.push(function(value) {
      if (angular.isUndefined(value) || value === null) {
        return '';
      } else if (angular.isObject(value) || angular.isArray(value)) {
        throw new Error('ui-codemirror cannot use an object or an array as a model');
      }
      return value;
    });


    // Override the ngModelController $render method, which is what gets called when the model is updated.
    // This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
    ngModel.$render = function() {
      //Code mirror expects a string so make sure it gets one
      //Although the formatter have already done this, it can be possible that another formatter returns undefined (for example the required directive)
      var safeViewValue = ngModel.$viewValue || '';
      codemirror.setValue(safeViewValue);
    };


    // Keep the ngModel in sync with changes from CodeMirror
    codemirror.on('change', function(instance) {
      var newValue = instance.getValue();
      if (newValue !== ngModel.$viewValue) {
        scope.$evalAsync(function() {
          ngModel.$setViewValue(newValue);
        });
      }
    });
  }

  function configUiRefreshAttribute(codeMirror, uiRefreshAttr, scope) {
    if (!uiRefreshAttr) { return; }

    scope.$watch(uiRefreshAttr, function(newVal, oldVal) {
      // Skip the initial watch firing
      if (newVal !== oldVal) {
        $timeout(function() {
          codeMirror.refresh();
        });
      }
    });
  }

}
uiCodemirrorDirective.$inject = ["$timeout", "uiCodemirrorConfig"];
