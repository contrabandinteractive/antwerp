import { Configuration, OpenAIApi } from "openai";
const fs = require('fs');
var uuid = require("uuid");

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

    
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    const body = req.body;
    await generateArt(body);
    res.status(200).json({path:image_url})
}
  