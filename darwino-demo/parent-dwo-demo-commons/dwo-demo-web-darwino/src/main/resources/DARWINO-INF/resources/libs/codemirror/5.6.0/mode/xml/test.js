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

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  var mode = CodeMirror.getMode({indentUnit: 2}, "xml"), mname = "xml";
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1), mname); }

  MT("matching",
     "[tag&bracket <][tag top][tag&bracket >]",
     "  text",
     "  [tag&bracket <][tag inner][tag&bracket />]",
     "[tag&bracket </][tag top][tag&bracket >]");

  MT("nonmatching",
     "[tag&bracket <][tag top][tag&bracket >]",
     "  [tag&bracket <][tag inner][tag&bracket />]",
     "  [tag&bracket </][tag&error tip][tag&bracket&error >]");

  MT("doctype",
     "[meta <!doctype foobar>]",
     "[tag&bracket <][tag top][tag&bracket />]");

  MT("cdata",
     "[tag&bracket <][tag top][tag&bracket >]",
     "  [atom <![CDATA[foo]",
     "[atom barbazguh]]]]>]",
     "[tag&bracket </][tag top][tag&bracket >]");

  // HTML tests
  mode = CodeMirror.getMode({indentUnit: 2}, "text/html");

  MT("selfclose",
     "[tag&bracket <][tag html][tag&bracket >]",
     "  [tag&bracket <][tag link] [attribute rel]=[string stylesheet] [attribute href]=[string \"/foobar\"][tag&bracket >]",
     "[tag&bracket </][tag html][tag&bracket >]");

  MT("list",
     "[tag&bracket <][tag ol][tag&bracket >]",
     "  [tag&bracket <][tag li][tag&bracket >]one",
     "  [tag&bracket <][tag li][tag&bracket >]two",
     "[tag&bracket </][tag ol][tag&bracket >]");

  MT("valueless",
     "[tag&bracket <][tag input] [attribute type]=[string checkbox] [attribute checked][tag&bracket />]");

  MT("pThenArticle",
     "[tag&bracket <][tag p][tag&bracket >]",
     "  foo",
     "[tag&bracket <][tag article][tag&bracket >]bar");

})();
