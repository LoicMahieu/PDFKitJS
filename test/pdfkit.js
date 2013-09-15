
var PDFKit = require('..');
var expect = require('chai').expect;
var fs = require('fs');
var stream = require('stream');

describe('PDFKit', function () {
  var outputFile = __dirname + '/generate/output.pdf';

  var expectEnd = function (done) {
    return function () {
      if (err) {
        return done(err);
      }

      if (fs.existsSync(outputFile)) {
        expect(fs.statSync(outputFile).size).to.be.gt(0);
        done();
      } else {
        done(new Error('File does not exists'));
      }
    }
  }

  var toFile = function (pdf, done) {
    pdf.toFile(outputFile, expectEnd(done));
  }

  beforeEach(function (done) {
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    done();
  });

  it('#toFile from URL', function (done) {
    var pdf = PDFKit('url', 'http://google.com', {}, {}, false);
    toFile(pdf, done);
  });

  it('#toFile from file', function (done) {
    var pdf = PDFKit('file', __dirname + '/fixtures/from_file.html', {}, {}, false);
    toFile(pdf, done);
  });

  it('#toFile from html', function (done) {
    var pdf = PDFKit('html', '<h1>Hello</h1>', {}, {}, false);
    toFile(pdf, done);
  });

  // Stream

  return;

  it('#toStream', function (done) {
    var pdf = PDFKit('html', '<h1>Hello</h1>', {}, {}, false);

    var out = pdf.toStream(function () {
      fileStream.on('end', expectEnd(done));
    });

    expect(out).to.be.instanceOf(stream.Readable);

    var fileStream = fs.createWriteStream(outputFile);
    out.pipe(fileStream);
  });

});



