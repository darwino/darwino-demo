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
  var mode = CodeMirror.getMode({indentUnit: 2}, "css");
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1)); }

  // Error, because "foobarhello" is neither a known type or property, but
  // property was expected (after "and"), and it should be in parenthese.
  MT("atMediaUnknownType",
     "[def @media] [attribute screen] [keyword and] [error foobarhello] { }");

  // Soft error, because "foobarhello" is not a known property or type.
  MT("atMediaUnknownProperty",
     "[def @media] [attribute screen] [keyword and] ([error foobarhello]) { }");

  // Make sure nesting works with media queries
  MT("atMediaMaxWidthNested",
     "[def @media] [attribute screen] [keyword and] ([property max-width]: [number 25px]) { [tag foo] { } }");

  MT("atMediaFeatureValueKeyword",
     "[def @media] ([property orientation]: [keyword landscape]) { }");

  MT("atMediaUnknownFeatureValueKeyword",
     "[def @media] ([property orientation]: [error upsidedown]) { }");

  MT("tagSelector",
     "[tag foo] { }");

  MT("classSelector",
     "[qualifier .foo-bar_hello] { }");

  MT("idSelector",
     "[builtin #foo] { [error #foo] }");

  MT("tagSelectorUnclosed",
     "[tag foo] { [property margin]: [number 0] } [tag bar] { }");

  MT("tagStringNoQuotes",
     "[tag foo] { [property font-family]: [variable hello] [variable world]; }");

  MT("tagStringDouble",
     "[tag foo] { [property font-family]: [string \"hello world\"]; }");

  MT("tagStringSingle",
     "[tag foo] { [property font-family]: [string 'hello world']; }");

  MT("tagColorKeyword",
     "[tag foo] {",
     "  [property color]: [keyword black];",
     "  [property color]: [keyword navy];",
     "  [property color]: [keyword yellow];",
     "}");

  MT("tagColorHex3",
     "[tag foo] { [property background]: [atom #fff]; }");

  MT("tagColorHex6",
     "[tag foo] { [property background]: [atom #ffffff]; }");

  MT("tagColorHex4",
     "[tag foo] { [property background]: [atom&error #ffff]; }");

  MT("tagColorHexInvalid",
     "[tag foo] { [property background]: [atom&error #ffg]; }");

  MT("tagNegativeNumber",
     "[tag foo] { [property margin]: [number -5px]; }");

  MT("tagPositiveNumber",
     "[tag foo] { [property padding]: [number 5px]; }");

  MT("tagVendor",
     "[tag foo] { [meta -foo-][property box-sizing]: [meta -foo-][atom border-box]; }");

  MT("tagBogusProperty",
     "[tag foo] { [property&error barhelloworld]: [number 0]; }");

  MT("tagTwoProperties",
     "[tag foo] { [property margin]: [number 0]; [property padding]: [number 0]; }");

  MT("tagTwoPropertiesURL",
     "[tag foo] { [property background]: [atom url]([string //example.com/foo.png]); [property padding]: [number 0]; }");

  MT("indent_tagSelector",
     "[tag strong], [tag em] {",
     "  [property background]: [atom rgba](",
     "    [number 255], [number 255], [number 0], [number .2]",
     "  );",
     "}");

  MT("indent_atMedia",
     "[def @media] {",
     "  [tag foo] {",
     "    [property color]:",
     "      [keyword yellow];",
     "  }",
     "}");

  MT("indent_comma",
     "[tag foo] {",
     "  [property font-family]: [variable verdana],",
     "    [atom sans-serif];",
     "}");

  MT("indent_parentheses",
     "[tag foo]:[variable-3 before] {",
     "  [property background]: [atom url](",
     "[string     blahblah]",
     "[string     etc]",
     "[string   ]) [keyword !important];",
     "}");

  MT("font_face",
     "[def @font-face] {",
     "  [property font-family]: [string 'myfont'];",
     "  [error nonsense]: [string 'abc'];",
     "  [property src]: [atom url]([string http://blah]),",
     "    [atom url]([string http://foo]);",
     "}");

  MT("empty_url",
     "[def @import] [tag url]() [tag screen];");

  MT("parens",
     "[qualifier .foo] {",
     "  [property background-image]: [variable fade]([atom #000], [number 20%]);",
     "  [property border-image]: [atom linear-gradient](",
     "    [atom to] [atom bottom],",
     "    [variable fade]([atom #000], [number 20%]) [number 0%],",
     "    [variable fade]([atom #000], [number 20%]) [number 100%]",
     "  );",
     "}");

  MT("css_variable",
     ":[variable-3 root] {",
     "  [variable-2 --main-color]: [atom #06c];",
     "}",
     "[tag h1][builtin #foo] {",
     "  [property color]: [atom var]([variable-2 --main-color]);",
     "}");

  MT("supports",
     "[def @supports] ([keyword not] (([property text-align-last]: [atom justify]) [keyword or] ([meta -moz-][property text-align-last]: [atom justify])) {",
     "  [property text-align-last]: [atom justify];",
     "}");

   MT("document",
      "[def @document] [tag url]([string http://blah]),",
      "  [tag url-prefix]([string https://]),",
      "  [tag domain]([string blah.com]),",
      "  [tag regexp]([string \".*blah.+\"]) {",
      "    [builtin #id] {",
      "      [property background-color]: [keyword white];",
      "    }",
      "    [tag foo] {",
      "      [property font-family]: [variable Verdana], [atom sans-serif];",
      "    }",
      "  }");

   MT("document_url",
      "[def @document] [tag url]([string http://blah]) { [qualifier .class] { } }");

   MT("document_urlPrefix",
      "[def @document] [tag url-prefix]([string https://]) { [builtin #id] { } }");

   MT("document_domain",
      "[def @document] [tag domain]([string blah.com]) { [tag foo] { } }");

   MT("document_regexp",
      "[def @document] [tag regexp]([string \".*blah.+\"]) { [builtin #id] { } }");

   MT("counter-style",
      "[def @counter-style] [variable binary] {",
      "  [property system]: [atom numeric];",
      "  [property symbols]: [number 0] [number 1];",
      "  [property suffix]: [string \".\"];",
      "  [property range]: [atom infinite];",
      "  [property speak-as]: [atom numeric];",
      "}");

   MT("counter-style-additive-symbols",
      "[def @counter-style] [variable simple-roman] {",
      "  [property system]: [atom additive];",
      "  [property additive-symbols]: [number 10] [variable X], [number 5] [variable V], [number 1] [variable I];",
      "  [property range]: [number 1] [number 49];",
      "}");

   MT("counter-style-use",
      "[tag ol][qualifier .roman] { [property list-style]: [variable simple-roman]; }");

   MT("counter-style-symbols",
      "[tag ol] { [property list-style]: [atom symbols]([atom cyclic] [string \"*\"] [string \"\\2020\"] [string \"\\2021\"] [string \"\\A7\"]); }");
})();
