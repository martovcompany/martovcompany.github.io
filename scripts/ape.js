import { ethers } from "https://martovcompany.github.io/scripts/ethers-5.2.esm.min.js";


const apeAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D" // on main
// const shoeNftAddress = "0x8A73787F47E9c0D18168252F8B3775ab3F64Fc18" // on main
// const frogNftAddress = "0xFA8DA81cC7dD4bF9Dc8a2f7743Ab0bE9be1c34fa" // on mumbai testnet
const frogNftAddress = "0x8f5d5DBE2df94A92626D729EEFD8351B14c29efA" // on Rinkeby testnet
const shoeNftAddress = "0x12DF4a75A25d2cE543aFCbe54fB275F9390bb2c9" // on Polygon mumbai test
const tovAddress = "0x89487436E74f06e118414fa5465E3b24e1b1e84F" // on Rinkeby testnet

let realURI = {"ipfs": "No ape", "attrs" : "", "account" : "", "Eyes" : "", "Head" : "", "Tov" : 0}


async function getApeBalance(ape) {
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

async function getApe(ape, db) {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log("W3 Account", account)
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
          realURI.account = account
        }
      } catch (err) {
        console.log("Error: ", err)
      }
    }
}

async function getFrog(frog) {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(frogNftAddress, frog.abi, provider)
            // register listener
//             contract.on("AnuranGenerated", (anuran) => {
//                 console.log("AnuranGenerated", anuran.eyewear, anuran.headwear);
//             });
            // check if has frog
            const balance = await contract.balanceOf(account)
            console.log("Balance", balance.toString())
//             for (var i = 0; i < balance.toNumber(); i++) {
//             if (data.toNumber() > 0) {
                // get token id
//                 for (var i = 0; i < data.toNumber(); i++) {
            if (balance.toNumber() > 0) {
                const tokenId = await contract.tokenOfOwnerByIndex(
                  account,
                  balance.toNumber() - 1
                )
                const res = await contract.getCharacterOverView(tokenId)
                realURI.Eyes = res.eyewear
                realURI.Head = res.headwear
            }
//                     emitUIInteraction({"Eyes" : res.eyewear, "Head" : res.headwear})
//                 }
//                 const tokenId = await contract.tokenOfOwnerByIndex(account, 0);
//                 const res = await contract.getCharacterOverView(tokenId);
                // load metadata
                // const [meta] = await Promise.all([fetch(metaURI)])
                // const metajson = await meta.json()
            realURI.ipfs = "no image"
//                 realURI.attrs = JSON.stringify({"Eyes" : res.eyewear, "Head" : res.headwear})
            realURI.account = account
//             }
        }
    } catch (e) {
        console.log("Get frog error", e)
    }
}

async function getRes() {
    const [apeRes, frogRes, dbRes] = await Promise.all([
        fetch('https://martovcompany.github.io/public/Ape.json'),
        fetch('https://martovcompany.github.io/public/FrogNFT.json'),
        fetch('https://martovcompany.github.io/public/db4.json')
      ]);
    let ape = await apeRes.json()
    let frog = await frogRes.json()
    let db = await dbRes.json()
    
    // await getBalance(ape)
    await getFrog(frog)
    // await getNFTs(ape, db)
}


async function buyShoe() {
    let [shoeRes] = await Promise.all([
        fetch('https://martovcompany.github.io/public/ShoeNFT.json')
    ]);
    let shoeNFT = await shoeRes.json()
    
   if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(shoeNftAddress, shoeNFT.abi, signer)
      try {
        const overrides = {
              value: ethers.utils.parseEther("0.01"), //sending one ether  
        }
        const data = await contract.buy(overrides)
        console.log("buy data", data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
}


async function getAccount() {
  if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      return account    
  } else {
      return ""
  }
}


async function getTov() {
    const [tovRes] = await Promise.all([
        fetch('https://martovcompany.github.io/public/Tov.json')
      ]);
    let tov = await tovRes.json()
    if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(tovAddress, tov.abi, provider)
        const balance = await contract.balanceOf(account);
        return balance.toNumber()
    } else {
        return 0
    }
}



async function myHandleResponseFunction(data) {
    console.warn("UE4 Response received!", data);
    switch (data) {
        case "OnMetaForgedLoaded":
            console.log("Meta Forged player LOADED from UE4")
            await getRes()
            console.log(realURI)
            emitUIInteraction(realURI)
            break;
        case "OnGameStateLoaded":
            console.log("Game state LOADED from UE4")
            const acc = await getAccount()
            const tov = await getTov()
            console.log("account", acc, "tov", tov)
            emitUIInteraction({"account" : acc, "Tov" : tov})
        case "RewardShoe":
            console.log("RewardShoe response received")
//             buyShoe();
            break;
        case "Replay":
            console.log("Replay response received")
//             location.reload();
            break;
    }
}


isPlaying.registerListener(async function(val) {
    addResponseEventListener("handle_responses", myHandleResponseFunction);
});
