# Code Styleguide

All code in any code-base should look like a single person typed it, no matter how many people contributed.

* Javascript syleguide reference is [idiomatic.js](https://github.com/rwaldron/idiomatic.js)
* Styleguide enforced using [js-beautify](https://github.com/einars/js-beautify)
  
The js-beautify plugin overrides the deaults with options specified in .jsbeautifyrc files.
  
In order of precedence, he plugin looks for .jsbeautifyrc in the following places:

1. The same directory as the source file you're prettifying 
2. The nearest parent directory above the file
3. In your home directory if everything else fails

### Default js-beautify Options

```javascript
{
  "html": {
    
    // List of extensions that are allowed
    "allowed_file_extensions": ["htm", "html", "xhtml", "shtml", "xml", "svg"],

    "brace_style": "collapse",       // [collapse|expand|end-expand|none]
    "end_with_newline": false,       // End output with newline
    "indent_char": " ",              // Indentation character
    "indent_handlebars": false,      // e.g. {{#foo}}, {{/foo}}
    "indent_inner_html": false,      // Indent <head> and <body> sections
    "indent_scripts": "keep",        // [keep|separate|normal]
    "indent_size": 4,                // Indentation size
    "max_preserve_newlines": 10,     // Maximum number of line-breaks to be preserved in one chunk
    "preserve_newlines": true,       // Preserve existing line-breaks
    "wrap_line_length": 0,           // Maximum characters per line (0 disables)

    // List of tags that should not be reformatted
    "unformatted": 
      ["a", "span", "img", "code", "pre", "sub", "sup", "em", "strong", "b", "i", "u", 
       "strike", "big","small", "pre", "h1", "h2", "h3", "h4", "h5", "h6"]

  },
  "css": {
    // List of extensions that are allowed
    "allowed_file_extensions": ["css", "scss", "sass", "less"],

    "end_with_newline": false,          // End output with newline
    "indent_char": " ",                 // Indentation character
    "indent_size": 4,                   // Indentation size
    "selector_separator": " ",
    "selector_separator_newline": false // Add a newline between multiple selectors

  },
  "js": {
    // List of extensions that are allowed
    "allowed_file_extensions": ["js", "json", "jshintrc", "jsbeautifyrc"],

    "brace_style": "collapse",          // [collapse|expand|end-expand|none]
    "break_chained_methods": false,     // Break chained method calls across subsequent lines
    "e4x": false,                       // Pass E4X xml literals through untouched
    "end_with_newline": false,          // End output with newline
    "eval_code": false,
    "indent_char": " ",                 // Indentation character
    "indent_level": 0,                  // Initial indentation level
    "indent_size": 4,                   // Indentation size
    "indent_with_tabs": false,          // Indent with tabs, overrides `indent_size` and `indent_char`
    "jslint_happy": false,              // Enable jslint-stricter mode
    "keep_array_indentation": false,    // Preserve array indentation
    "keep_function_indentation": false,
    "max_preserve_newlines": 10,        // Number of line-breaks to be preserved in one chunk
    "preserve_newlines": true,          // Preserve line-breaks
    "space_after_anon_function": false, // Add a space before an anonymous function's parens, ie. function ()
    "space_before_conditional": true,
    "space_in_empty_paren": false,
    "space_in_paren": false,            // Add padding spaces within paren, ie. f( a, b )
    "unescape_strings": false,          // Decode printable characters encoded in xNN notation
    "wrap_line_length": 0               // Wrap lines at next opportunity after N characters
  }
}
```