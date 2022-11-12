# antwerp

## How to run

antwerp is a Next.js project. It can be built by running the following commands in its directory:

npm install
npm run dev

You must also add your own .env.local file to the project directory. It should contain API keys for AWS S3, web3.storage and OpenAI.
More info on this here: https://nextjs.org/docs/basic-features/environment-variables

Your file should look like this:

web3storage_key=XXXXXX

openai_key=XXXXXX

near_env=development

s3_access_key=XXXXXX

s3_secret=XXXXXX

s3_region=us-east-2

s3_bucket=XXXXXX


## Inspiration

The app's name **antwerp** was inspired by the legendary Flemish artists from 16th and 17th century Belgium. The goal of the app is to make a simple, easy-to-use tool that mints unique NFTs on the NEAR Protocol using images generated from the most advanced AI system around today, DALL-E 2. With **antwerp**, all you need is a short text description of any wild idea to create a truly unique NFT on NEAR.

## What it does

**antwerp** is currently set up to work on the **NEAR Testnet**. After logging in, simply provide it with a short but detailed description of any idea. For example:

_"an astronaut riding a blue horse"_

_"an oil painting of a dog wearing a red French painter's hat"_

_"a children's crayon drawing of an orangutan on a beach"_

You can command the app to produce art in virtually any style imaginable, whether you desire a realistic photo, a pencil sketch, or even an oil painting.

## How we built it

**antwerp** was written in Next.js, a React framework. It uses bleeding edge technology, including DALL-E 2's API (which was just released less than 2 months ago) along with web3.storage API for uploading this artwork to the decentralized IPFS network. It also stores a copy of the image to an AWS S3 bucket for reference.

The smart contract it uses was written in Rust and deployed to the NEAR Testnet. It uses the NEAR JS API to interact with the contract. The contract has been deployed to **antwerp.contrabandinteractive.testnet**
