# PDFKitJs

Create PDFs using plain old HTML+CSS. Uses [wkhtmltopdf](https://github.com/antialize/wkhtmltopdf) on the back-end which renders HTML using Webkit.

Hightly inspired by [PDFKit](https://github.com/pdfkit/pdfkit) written in Ruby

## Install

### PDFKit
```bash
npm install pdfkit
```
### wkhtmltopdf

<https://github.com/pdfkit/pdfkit/wiki/Installing-WKHTMLTOPDF>

## Usage
```js
// PDFKit support multiples types (url, file, html) and any options for wkhtmltopdf
// run `wkhtmltopdf --extended-help` for a full list of options
var PDFKit = require('pdfkitjs');

pdf = new PDFKit('url', 'http://google.com');

pdf.toFile('google.pdf', function (err, file) {
  console.log('File ' + file + ' written');
});
```

## API

### PDFKit(type, url_file_or_html[, options[, spawnOptions[, logger]]])

`options` : Object corresponding on wkhtmltopdf arguments. run `wkhtmltopdf --extended-help` for a full list of options

`spawnOptions` : Options passed to [`child_process.spawn`](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) except `exec` who is the path to the wkhtmltopdf binary. (Default: `wkhtmltopdf`)

* `url`
```js
new PDFKit('url', 'http://google.com')
```

* `file`
```js
new PDFKit('file', 'path/to/some.html')
```

* `html`
```js
new PDFKit('html', '<h1>Hello</h1>')
```


### Logger

You can pass a logger object that implemnts `log`, `warn`, `debug` methods. Default logger:
```js
var baseLogger = {
  log: console.log,
  warn: console.warn,
  debug: console.log
};
```

To silent all logs, you can pass `false`.


### Output

TODO


## Copyright

Copyright (c) 2010 Loïc Mahieu.
