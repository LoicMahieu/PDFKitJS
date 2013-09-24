
var _ = require('lodash');
var child_process = require('child_process');
var util = require('util');
var fs = require('fs');
var stream = require('stream');
var events = require('events');
var tmp = require('temporary');


var noop = function () {};

var baseOptions = {
  disable_smart_shrinking: false,
  page_size: 'Letter',
  margin_top: '0.75in',
  margin_right: '0.75in',
  margin_bottom: '0.75in',
  margin_left: '0.75in',
  encoding: "UTF-8"
};

var baseSpawnOptions = {
  exec: 'wkhtmltopdf'
};

var baseLogger = {
  log: console.log,
  warn: console.warn,
  debug: console.log
};
var silentLogger = {
  log: noop,
  warn: noop,
  debug: noop
};


var PDFKit = module.exports = function PDFKit (type, url_file_or_html, options, spawnOptions, logger) {
  if (!(this instanceof PDFKit)) {
    return new PDFKit(type, url_file_or_html, options, spawnOptions, logger);
  }

  this.options = _.extend({}, baseOptions, options);
  this.spawnOptions = _.extend({}, baseSpawnOptions, spawnOptions);
  this.type = type;
  this.url_file_or_html = url_file_or_html;
  this.logger = typeof logger == 'undefined' ? baseLogger : (logger || silentLogger);
  this.outfile = (new tmp.File()).path;
};

util.inherits(PDFKit, events.EventEmitter);

PDFKit.prototype.toFile = function (file, callback) {
  this._execute(file);
  this.on('error', callback);
  this.on('end', callback);
  return this;
};


// Privates

PDFKit.prototype._execute = function (outfile) {
  var self = this;
  var args = [
    (this.type != 'html' ? this.url_file_or_html : '-'),
    outfile || this.outfile
  ];
  var exited = false;

  // Debugging
  this.logger.debug('Exec ' + this.spawnOptions.exec + ' ' + args.join(' '));

  // Spawn new process
  this.child = child_process.spawn(this.spawnOptions.exec, args, this.spawnOptions);

  // Logging
  this.child.stdout.on('data', function (data) {
    self.logger.debug(data);
  });
  this.child.stderr.on('data', function (data) {
    if (exited) {
      return;
    }

    data = data.toString().trim();

    err = data.match(/error: .+/i);

    if (err) {
      self.emit('error', err);
    } else {
      self.logger.debug(data);
    }
  });

  // Error handling
  this.child.on('error', function (err) {
    exited = true;
    self.emit('error', err);
  });

  // Inject HTML in stdin
  if (self.type == 'html') {
    process.nextTick(function () {
        if (exited) {
          return;
        }
        self.child.stdin.write(self.url_file_or_html + '\n');
        self.child.stdin.end();
    });
  }

  this.child.on('exit', function () {
    self.emit('end');
  });

  return this;
};
