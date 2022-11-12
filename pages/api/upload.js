//import { Web3Storage, File } from 'web3.storage'
import React, { useState } from 'react';
//import { Web3Storage,getFilesFromPath } from 'web3.storage/dist/bundle.esm.min.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Web3Storage,getFilesFromPath } from 'web3.storage';
//import { getFilesFromPath } from 'web3.storage';
import { filesFromPath } from 'files-from-path';
const fs = require('fs');
import { tmpdir } from 'os';
const fetch = require('node-fetch');
var file_url;
var final_cid;

function getAccessToken () {
    return process.env.web3storage_key
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}
  
  
async function storeWithProgress (files) {
    
    console.log('about to store '+files);

    const client = makeStorageClient()
    //const thefiles = await getFilesFromPath('./public/images/'+files);

    const s3Client = new S3Client({
        region: process.env.s3_region,
        credentials: {
          accessKeyId: process.env.s3_access_key,
          secretAccessKey: process.env.s3_secret,
        },
    });

    
    const response = await s3Client
    .send(new GetObjectCommand({
        Key: files+'.png',
        Bucket: process.env.s3_bucket,
    }))
    const stream = response.Body

    function gettheBuffer(stream){
        return new Promise((resolve, reject) => {
            const chunks = []
            stream.on('data', chunk => chunks.push(chunk))
            stream.once('end', () => resolve(Buffer.concat(chunks)))
            stream.once('error', reject)
        })
    }

    const streamP = await gettheBuffer(stream);
   /*
    function getObject (Bucket, Key) {
        return new Promise(async (resolve, reject) => {
          const getObjectCommand = new GetObjectCommand({ Bucket, Key })
      
          try {
            const response = await s3Client.send(getObjectCommand)
        
            // Store all of data chunks returned from the response data stream 
            // into an array then use Array#join() to use the returned contents as a String
            let responseDataChunks = []
      
            // Handle an error while streaming the response body
            response.Body.once('error', err => reject(err))
        
            // Attach a 'data' listener to add the chunks of data to our array
            // Each chunk is a Buffer instance
            response.Body.on('data', chunk => responseDataChunks.push(chunk))
        
            // Once the stream has no more data, join the chunks into a string and return the string
            response.Body.once('end', () => resolve(responseDataChunks.join('')))
          } catch (err) {
            // Handle the error or throw
            return reject(err)
          } 
        })
      }
    //
    let streamP = await getObject(process.env.s3_bucket, files+'.png');
    */
      
    const tempFile = new fs.writeFile('./tmp/'+files+'.png', streamP, () => 
    console.log('finished creating file!'))

    const thefiles = await getFilesFromPath('./tmp'); 

    const cid = await client.put(thefiles);
    

    

    console.log('stored files with cid:', cid)
    console.log('client result: '+client);
    final_cid = cid;
    return cid
}

async function uploadFile(body) {
    await storeWithProgress(body.file);
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    const body = req.body
    await uploadFile(body);
    res.status(200).json({cid:final_cid})
}
  