import Head from 'next/head'
import React, { useState } from "react";
import Image from 'next/image';
import { initContract, login, logout, mintMyNFT, getTheNFT } from './components/utils'
//import MintingTool from "./Components/MintingTool";
//import InfoBubble from "./Components/InfoBubble";
const BN = require("bn.js");
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

export default function Home(props) {

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);


  const [theProgress, setTheProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [theCategories, setTheCategories] = useState([]);
  const [displayList, setDisplayList] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [btnText, setBtnText] = useState("Go");
  const [userHasNFT, setuserHasNFT] = useState(false);
  const [nftTitle, setNftTitle] = useState("");
  const [nftUrl, setNftUrl] = useState("");
  const [nearAccountId, setNearAccountId] = useState(props.predata);

  const [nftModalOwner, setNftModalOwner] = useState("");
  const [nftModalTitle, setNftModalTitle] = useState("NFT not found.");
  const [nftModalMedia, setNftModalMedia] = useState("");

  const viewNFT = async () => {
    await initContract();
    let nftList = await getTheNFT();
    console.log(nftList[0].owner_id);
    setNftModalOwner(nftList[0].owner_id);
    setNftModalTitle(nftList[0].metadata.title);
    setNftModalMedia(nftList[0].metadata.media);
    setOpen(true)
  }

  const generateArt = async () => {
    // generate art
    setTheProgress(2);
    let thePrompt = document.getElementById("desc").value;
    setNftTitle(thePrompt);
    console.log(thePrompt);
    const artData = {
      desc: thePrompt
    }
    const JSONartdata = JSON.stringify(artData)
    const endpoint = '/api/generate'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONartdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    console.log(result.path);
    let folderID = result.path;
    
    // upload to IPFS
    setTheProgress(3);
    const data = {
        file: result.path
    }
    const JSONdata = JSON.stringify(data)

    const uploadEndpoint = '/api/upload'
    const uploadOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
    }
    const uploadResponse = await fetch(uploadEndpoint, uploadOptions)
    const uploadResult = await uploadResponse.json()

    console.log('uploadResult '+uploadResult);
    setImageUrl('/images/'+folderID+'/art.png');
    setTheProgress(4);
    setNftUrl('https://'+uploadResult.cid+'.ipfs.w3s.link/'+folderID+'/art.png');
    
  };

  const loginBtn = async () => {
    await initContract();
    await login();
  };

  const mintNFT = async () => {
    await initContract();
    await mintMyNFT(nftTitle,nftUrl);
  };

 
  return (
    <div className="container">
      <Head>
        <title>antwerp</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300&display=swap" rel="stylesheet"/> 
      </Head>

      <main>
        
        {/*}
        <Image src="./images/e6d09f1b-e89a-4d64-98c5-7c780853bdb0/art.png" width="300px" height="50px" />
        */}
        

        <h1>antwerp</h1>


        <div className="grid">
          {theProgress == 0 && nearAccountId==null &&
          <>
            <p className="description">Login with a wallet on the NEAR Testnet. <a href="https://wallet.testnet.near.org/">Create one here if you don't have one.</a></p>
            <button className="btn" onClick={loginBtn}>Login</button>
          </>
          }
          {theProgress == 0 && nearAccountId!=null &&
            <div className="card">
              <p className="description">
                Enter a detailed description of the NFT artwork you'd like to generate using DALL-E. 
              </p>
              <input type="text" name="desc" id="desc" placeholder="Text description" />
              <button className="btn" onClick={generateArt}>Generate</button>
              <p>Or...</p>
              <button className="btn" onClick={viewNFT}>View NFT</button>

              <div>
                <Modal open={open} onClose={onCloseModal} center>
                  <p></p>
                  <div className="imageContainer"><Image src={nftModalMedia} width="256px" height="256px" /></div>
                  <p>Owner: {nftModalOwner}</p>
                  <p>{nftModalTitle}</p>
                </Modal>
              </div>

            </div>
          }
          {theProgress == 2 &&
            <div className="card">
            <p className="description">
              Generating artwork using DALL-E machine learning models...
            </p>
            </div>
          }
          {theProgress == 3 &&
            <div className="card">
            <p className="description">
              Uploading artwork to IPFS...
            </p>
            </div>
          }
          {theProgress == 4 &&
          <>
            <div className="imageContainer"><Image src={imageUrl} width="256px" height="256px" /></div>
            <button className="btn mintbtn" onClick={mintNFT}>Mint NFT</button>
          </>
          }
        </div>
      </main>

      <footer>
          <p><a href="https://contrabandinteractive.com" target="_blank">Contraband Interactive</a></p>
      </footer>

      <style jsx>{`
        
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color:#fff;
        }

        button {
          text-align: center;
          margin: 0 auto;
          display: block;
          padding: 20px;
          margin-top: 20px;
          font-size: 20px;
          border-radius: 10px;
          border-color: transparent;
          background-color: #00a896;
          color: #f0f3bd;
          font-weight: bold;
          font-family: 'Comfortaa', cursive;
        }

        button:hover{
          cursor:pointer;
        }

        #desc {
          font-size: 20px;
          border-radius: 10px;
          padding: 20px;
          border-color: transparent;
          background-color: #f0f3bd;
          color: #05668d;
          font-family: 'Comfortaa', cursive;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          //color: inherit;
          text-decoration: none;
          color: #f0f3bd;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          color:#f0f3bd;
          padding-bottom:20px;
        }

        p {
          color:#f0f3bd;
          font-family: 'Comfortaa', cursive;
        }

        h1 {
          color: #f0f3bd;
          font-family: 'Comfortaa', cursive;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 0px;
        }

        .card {
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .badCard {
          background-color: darkred;
          color: #fff !important;
          font-size: 20px;
          font-weight: bold;
        }

        .goodCard {
          background-color: green;
          color: #fff !important;
          font-size: 20px;
          font-weight: bold;
        }

        .logo {
          height: 1em;
        }

        .profileLink {
          color:gold !important;
        }

        .imageContainer {
          width:100%;
          clear:both;
          display:block;
          margin:0 auto;
          text-align:center;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        body{
          background-color: #05668d;
        }

        .react-responsive-modal-modal {
          background-color: #000 !important;
        }

      `}</style>
    </div>
  )
}

export async function getServerSideProps(context) {
  let predata = null;
  if(context.query.account_id!=null){
    predata = context.query.account_id;
  }
  return { props: { predata } };

}
