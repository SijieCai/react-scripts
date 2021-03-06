process.env.NODE_ENV = 'production';

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const queriesBucket = process.env.QUERIES_S3_BUCKET;
const uploadParams = {
  Bucket: queriesBucket,
  Key: '',
  Body: '',
  ACL: 'public-read',
  // Sets Cache-Control header and in Metadata
  CacheControl: 'public, max-age=31536000',
};
const baseDir = './build/queries';

if (!queriesBucket) {
  console.error('QUERIES_S3_BUCKET is empty. Exiting.');
  process.exit(1);
}

fs.readdir(baseDir, (err, files) => {
  files.forEach((file) => {
    const fileStream = fs.createReadStream(path.join(baseDir, file));
    fileStream.on('error', (err) => {
      console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = `queries/${file}`;

    // Sets Content-Type header and in Metadata
    const type = mime.getType(file);
    if (type) {
      uploadParams.ContentType = type;
    }
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log('Error', err);
      }
      if (data) {
        console.log('Queries upload Success', data.Location);
      }
    });
  });
});
