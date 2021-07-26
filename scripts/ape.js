import { ethers } from "https://martovcompany.github.io/scripts/ethers-5.2.esm.min.js";
// let ethers = require("https://dai-martov.github.io/scripts/ethers-5.2.esm.min.js")

const apeAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
let realURI = {"ipfs": "No ape", "attrs" : ""}

async function getBalance(ape) {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(apeAddress, ape.abi, provider)
      try {
        const data = await contract.balanceOf(account)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
}

async function getNFTs(ape, db) {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(apeAddress, ape.abi, provider)
      try {
        const data = await contract.tokenOfOwnerByIndex(account, 0)
        console.log('NFT: ', data.toString())
        if (data != '') {
          let imageURI = db[data]['ipfs']
          let id = imageURI.split("//")[1]
          realURI.ipfs = "ipfs.io/ipfs/" + id
          realURI.attrs = JSON.stringify(db[data]["attributes"])
        }
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

async function getRes() {
    let json_data = await fetch('https://dai-martov.github.io/public/Ape.json')
    const [apeRes, dbRes] = await Promise.all([
        fetch('https://martovcompany.github.io/public/Ape.json'),
        fetch('https://martovcompany.github.io/public/db4.json')
      ]);
    let ape = await apeRes.json()
    let db = await dbRes.json()
    realURI.attrs = JSON.stringify(db["4486"]["attributes"])
    
    await getBalance(ape)
    await getNFTs(ape, db)

    //return [ape, db]
}


function myHandleResponseFunction(data) {
    console.warn("UE4 Response received!");
    switch (data) {
        case "RewardShoe":
            console.log("RewardShoe response received")
    }
}


isPlaying.registerListener(async function(val) {
    await getRes()
    console.log(realURI)
    emitUIInteraction(realURI)
    addResponseEventListener("handle_responses", myHandleResponseFunction);
});



// setTimeout(async function(){
//     await getRes()
//     console.log(realURI)
//     emitUIInteraction(realURI)
//     addResponseEventListener("handle_responses", myHandleResponseFunction);
// }, 1000);
