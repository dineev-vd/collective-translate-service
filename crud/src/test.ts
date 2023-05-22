// const officeparser = require('officeparser');
// const { XMLParser, XMLBuilder } = require('fast-xml-parser');
// const util = require('util');
// const flatten = require('flat');
// const unflatten = require('flat').unflatten;
// const yazl = require('yazl');
// const fs = require('fs');

// const yauzl = require('yauzl');

// const replacement = { 'w:document.w:body.w:p.0.w:r.0.w:t': '123123' };

// function stream2buffer(stream) {
//   return new Promise((resolve, reject) => {
//     const _buf = [];

//     stream.on('data', (chunk) => _buf.push(chunk));
//     stream.on('end', () => resolve(Buffer.concat(_buf)));
//     stream.on('error', (err) => reject(err));
//   });
// }

// const newzip = new yazl.ZipFile();

// yauzl.open('./test.docx', { lazyEntries: true }, (err, zipfile) => {
//   zipfile.readEntry();
//   zipfile.on('entry', (entry) => {
//     zipfile.openReadStream(entry, (err, readstream) => {
//       stream2buffer(readstream).then((buffer) => {
//         let newbuffer;

//         if (entry.fileName.endsWith('document.xml')) {
//           const parser = new XMLParser({
//             ignoreAttributes: false,
//           });

//           const parsedDocument = parser.parse(buffer);

//           console.log(parsedDocument);

//           const flattenedDocument = flatten(parsedDocument);

//           Object.entries(replacement).forEach(
//             ([key, value]) => (flattenedDocument[key] = value),
//           );

//           const unflattened = unflatten(flattenedDocument);

//           const builder = new XMLBuilder({
//             ignoreAttributes: false,
//           });
//           const xmlContent = builder.build(unflattened);
//           newbuffer = Buffer.from(xmlContent, 'utf8');
//         } else {
//           newbuffer = buffer;
//         }

//         newzip.addBuffer(newbuffer, entry.fileName);

//         zipfile.readEntry();
//       });
//     });
//   });

//   zipfile.on('end', function () {
//     console.log('Completed extracting all files');

//     // all files added
//     newzip.end();

//     const writableStream = fs.createWriteStream('test_tr.docx');

//     // store on s3
//     newzip.outputStream.pipe(writableStream).on('close', function () {
//       console.log('ok');
//     });
//   });
// });
