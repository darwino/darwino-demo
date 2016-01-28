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

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  var mode = CodeMirror.getMode({indentUnit: 2}, "text/x-c");
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1)); }

  MT("indent",
     "[variable-3 void] [def foo]([variable-3 void*] [variable a], [variable-3 int] [variable b]) {",
     "  [variable-3 int] [variable c] [operator =] [variable b] [operator +]",
     "    [number 1];",
     "  [keyword return] [operator *][variable a];",
     "}");

  MT("indent_switch",
     "[keyword switch] ([variable x]) {",
     "  [keyword case] [number 10]:",
     "    [keyword return] [number 20];",
     "  [keyword default]:",
     "    [variable printf]([string \"foo %c\"], [variable x]);",
     "}");

  MT("def",
     "[variable-3 void] [def foo]() {}",
     "[keyword struct] [def bar]{}",
     "[variable-3 int] [variable-3 *][def baz]() {}");

  MT("double_block",
     "[keyword for] (;;)",
     "  [keyword for] (;;)",
     "    [variable x][operator ++];",
     "[keyword return];");
})();
