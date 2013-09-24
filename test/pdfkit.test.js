
var PDFKit = require('..');
var expect = require('chai').expect;
var fs = require('fs');
var stream = require('stream');
var mkdirp = require('mkdirp');

describe('PDFKit', function () {
  var outputDir = __dirname + '/generate';

  var expectEnd = function (outputFile, done) {
    return function (err) {
      if (err) {
        return done(err);
      }

      if (fs.existsSync(outputFile)) {
        expect(fs.statSync(outputFile).size).to.be.gt(0);
        done();
      } else {
        done(new Error('File does not exists'));
      }
    };
  };

  var toFile = function (pdf, outputFile, done) {
    pdf.toFile(outputFile, expectEnd(outputFile, done));
  };


  beforeEach(function (done) {
    mkdirp(outputDir, done);
  });


  it('#toFile from URL', function (done) {
    var pdf = PDFKit('url', 'http://google.com', {}, {}, false);
    toFile(pdf, outputDir + '/tofile_from_url.pdf', done);
  });

  it('#toFile from file', function (done) {
    var pdf = PDFKit('file', __dirname + '/fixtures/from_file.html', {}, {}, false);
    toFile(pdf, outputDir + '/tofile_from_file.pdf', done);
  });

  it('#toFile from html', function (done) {
    var pdf = PDFKit('html', '<h1>Hello</h1>', {}, {}, false);
    toFile(pdf, outputDir + '/tofile_from_html.pdf', done);
  });

  // Stream

  /*it('#toStream', function (done) {
    var pdf = PDFKit('html', '<h1>Hello</h1>', {}, {}, false);

    var out = pdf.toStream(function () {
      fileStream.on('end', expectEnd(done));
    });

    expect(out).to.be.instanceOf(stream.Readable);

    var fileStream = fs.createWriteStream(outputFile);
    out.pipe(fileStream);
  });*/

});

// Can not catch errro???
/*
describe('Error handling', function () {
  it('Emit `error` when binary is unreachable.', function (done) {
    var pdf = PDFKit('html', '<h1>Hello</h1>', {}, {
      exec: 'wkhtmltopdf/isnt/here'
    }, false);

    pdf.toFile('/tmp/test.pdf', function (err) {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });
});
*/

