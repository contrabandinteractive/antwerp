import { Configuration, OpenAIApi } from "openai";
const fs = require('fs');
var uuid = require("uuid");
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const configuration = new Configuration({
    apiKey: process.env.openai_key,
  });
const openai = new OpenAIApi(configuration);
var resultArray = [];
var image_url;

async function generateArt(body) {
    resultArray = [];
    const response = await openai.createImage({
        prompt: body.desc,
        n: 1,
        size: "256x256",
    });
    let initial_image_url = response.data.data[0].url;

    const response2 = await fetch(initial_image_url);
    const buffer = await response2.buffer();



    var id = uuid.v4();
    image_url = id;
    const s3Client = new S3Client({
        region: process.env.s3_region,
        credentials: {
          accessKeyId: process.env.s3_access_key,
          secretAccessKey: process.env.s3_secret,
        },
    });
    
    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.s3_bucket,
        Key: image_url+'.png',
        Body: buffer,
    });
    
    const response3 = await s3Client.send(uploadCommand);
    
    console.log('response3 '+response3);


    /*
    const s3 = new aws.S3({
        accessKeyId: process.env.s3_access_key,
        secretAccessKey: process.env.s3_secret,
        region: process.env.s3_region,
        signatureVersion: 'v4',
      });
      
    const uploadToFirstS3 = (stream) => (new Promise((resolve, reject) => {
        const uploadParams = {
          Bucket: process.env.s3_bucket,
          Key: 'some-key',
          Body: buffer,
        };
        s3.upload(uploadParams, (err) => {
          if (err) reject(err);
          resolve(true);
        });
    }));

    console.log('uploadToFirstS3 '+uploadToFirstS3);
    */

    
    
    /*
    var id = uuid.v4();
    image_url = id;
    console.log("image url"+image_url);

    // directory path
    const dir = './public/images/'+image_url

    // create new directory
    fs.mkdir(dir, err => {
    if (err) {
        throw err
    }
        const files = fs.writeFile(dir+'/art.png', buffer, () => 
        console.log('finished downloading!'));
    })
    */

    
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    const body = req.body;
    await generateArt(body);
    res.status(200).json({path:image_url})
}
  