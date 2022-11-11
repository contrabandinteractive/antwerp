//import { Web3Storage, File } from 'web3.storage'
import React, { useState } from 'react';
//import { Web3Storage,getFilesFromPath } from 'web3.storage/dist/bundle.esm.min.js';
import { Web3Storage,getFilesFromPath } from 'web3.storage';
//import { getFilesFromPath } from 'web3.storage';
import { filesFromPath } from 'files-from-path';
const fs = require('fs');
const fetch = require('node-fetch');
//import { promises as fs } from "fs";
var file_url;
var final_cid;

function getAccessToken () {
    return process.env.web3storage_key
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}
  
  
async function storeWithProgress (files) {
    /*
    // show the root cid as soon as it's ready
    const onRootCidReady = cid => {
      console.log('uploading files with cid:', cid)
      ipfsID = cid;
    }
    
    

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = size => {
      uploaded += size
      const pct = 100 * (uploaded / totalSize)
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient()

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
    */
    console.log('about to store '+files);
    //const cid = 'test'
    const client = makeStorageClient()
    const thefiles = await getFilesFromPath('./public/images/'+files);
    const cid = await client.put(thefiles);
    
    /*
    for await (const f of filesFromPath('./images')) {
        console.log(f)
        const cid2 = await client.put(f)
        console.log('just finished '+cid2);
        // { name: '/path/to/me', stream: [Function: stream] }
    }
    */
    

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
  