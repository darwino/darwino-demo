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

describe('controllers', function() {
  var items, scroll, scope;

  beforeEach(module(function($provide) {
    items = jasmine.createSpyObj('items', ['getItemsFromServer', 'next', 'clearFilter', 'filterBy']);
    scroll = jasmine.createSpyObj('scroll', ['pageDown', 'toCurrent']);

    // mock out services
    $provide.value('items', items);
    $provide.value('scroll', scroll);
  }));

  beforeEach(inject(function($rootScope) {
    scope = $rootScope;
  }));


  describe('App', function() {
    beforeEach(inject(function($controller) {
      $controller(AppController, {$scope: scope});
    }));


    it('should publish items service', function() {
      expect(scope.items).toBe(items);
    });


    it('should scroll when selectedIdx change to not null value', function() {
      expect(scroll.toCurrent).not.toHaveBeenCalled();

      scope.$apply(function() {
        items.selectedIdx = 1;
      });
      expect(scroll.toCurrent).toHaveBeenCalled();
      scroll.toCurrent.reset();

      scope.$apply(function() {
        items.selectedIdx = 0;
      });
      expect(scroll.toCurrent).toHaveBeenCalled();
      scroll.toCurrent.reset();

      scope.$apply(function() {
        items.selectedIdx = null;
      });
      expect(scroll.toCurrent).not.toHaveBeenCalled();
    });


    describe('refresh', function() {
      it('should call items.getItemsFromServer()', function() {
        scope.refresh();
        expect(items.getItemsFromServer).toHaveBeenCalled();
        expect(items.getItemsFromServer.callCount).toBe(1);
      });
    });


    describe('handleSpace', function() {
      it('should scroll page down', function() {
        scope.handleSpace();
        expect(scroll.pageDown).toHaveBeenCalled();
        expect(scroll.pageDown.callCount).toBe(1);
      });


      it('should call items.next() if not scrolled', function() {
        scroll.pageDown.andReturn(false);
        scope.handleSpace();
        expect(items.next).toHaveBeenCalled();
        expect(items.next.callCount).toBe(1);
      });
    });
  });


  describe('NavBar', function() {
    beforeEach(inject(function($controller) {
      $controller(NavBarController, {$scope: scope});
    }));


    it('should delegate methods to items service', function() {
      scope.showAll();
      expect(items.clearFilter).toHaveBeenCalled();

      scope.showUnread();
      expect(items.filterBy).toHaveBeenCalledWith('read', false);
      items.filterBy.reset();

      scope.showRead();
      expect(items.filterBy).toHaveBeenCalledWith('read', true);
      items.filterBy.reset();

      scope.showStarred();
      expect(items.filterBy).toHaveBeenCalledWith('starred', true);
    });
  });
});
