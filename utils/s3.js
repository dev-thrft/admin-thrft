const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');
const randBytes = promisify(crypto.randomBytes(16));


const bucketName = 'thrft-products';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_ACCESS_KEY_ID;
const region = 'us-east-1';

const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
    region,
    signatureVersion: 'v4'
});

async function generateUploadURL() {
    const rawBytes = await randBytes(16);
    const imageName = rawBytes.toString('hex'); // generate random name

    const s3Params = {
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    };
    

    const signedURL = await s3.getSignedUrlPromise('putObject', s3Params); // generate signed url

    return signedURL;
}
async function deleteImage(key) {
    const imageName = key;

    const s3Params = {
        Bucket: bucketName,
        Key: imageName
    };
    
    return await s3.deleteObject(s3Params).promise();
}

exports = {
    generateUploadURL,
    deleteImage
};