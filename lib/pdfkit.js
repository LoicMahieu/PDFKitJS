
var _ = require('lodash');
var child_process = require('child_process');
var util = require('util');
var fs = require('fs');
var stream = require('stream');
var events = require('events');

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


var fireOnce = function (callback, context) {
  return function () {
    if (!callback) {
      return;
    }
    callback.apply(context, arguments);
    callback = null
  };
}


var PDFKit = module.exports = function PDFKit (type, url_file_or_html, options, spawnOptions, logger) {
  if (!(this instanceof PDFKit)) {
    return new PDFKit(type, url_file_or_html, options, spawnOptions, logger);
  }

  this.readable = true;
  this.writable = true;

  this.options = _.extend({}, baseOptions, options);
  this.spawnOptions = _.extend({}, baseSpawnOptions, spawnOptions);
  this.type = type;
  this.url_file_or_html = url_file_or_html;
  this.logger = typeof logger == 'undefined' ? baseLogger : (logger || silentLogger);
};

util.inherits(PDFKit, events.EventEmitter);

PDFKit.prototype.toFile = function (file, callback) {
  var self = this;
  var fired = false;
  var out = fs.createWriteStream(file);
  
  callback = fireOnce(callback);

  this.start();
  this.child.stdout.pipe(out);
  this.on('error', callback);
  this.child.on('exit', function (code) {
    callback();
  });

  return out;
};

PDFKit.prototype.toStream = function (callback) {
  this.start();
  this.on('error', callback);
  this.child.on('exit', function (code) {
    callback();
  });
  return this.child.stdout;
};

PDFKit.prototype.start = function (callback) {
  this._execute();
  if (callback) {
    this.on('end', callback);
  }
  return this;
};


// Privates

PDFKit.prototype._args = function () {
  var args = [];

  if (this.type != 'html') {
    args.push(this.url_file_or_html);
  } else {
    args.push('-');
  }

  args.push('-');

  return args;
};

PDFKit.prototype._execute = function () {
  var self = this;
  var args = this._args();

  this.logger.debug('Exec ' + this.spawnOptions.exec + ' ' + args.join(' '));
  this.child = child_process.spawn(this.spawnOptions.exec, args, this.spawnOptions);

  this.child.stderr.on('data', function (data) {
    data = data.toString().trim();

    err = data.match(/error: .+/i);

    if (err) {
      this.emit('error', err);
    } else {
      self.logger.debug(data);
    }
  });

  if (this.type == 'html') {
    this.child.stdin.write(this.url_file_or_html + '\n');
    this.child.stdin.end();
  }

  return this.child;
};
