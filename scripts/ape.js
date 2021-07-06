import { ethers } from "https://dai-martov.github.io/scripts/ethers-5.2.esm.min.js";

const apeAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"

async function getBalance(ape) {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const contract = new ethers.Contract(apeAddress, ape.abi, provider)
      try {
        const data = await contract.balanceOf(account)
        console.log('balance: ', data.toString())
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
}

async function getNFTs(ape, db) {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const contract = new ethers.Contract(apeAddress, ape.abi, provider)
      try {
        const data = await contract.tokenOfOwnerByIndex(account, 0)
        console.log('NFT: ', data.toString())
        if (data != '') {
          emitUIInteraction(data)
          let imageURI = db[data]
          let id = imageURI.split("//")[1]
          let realURI = "ipfs.io/ipfs" + id
          console.log(realURI)
        }
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

async function getRes() {
    let json_data = await fetch('https://dai-martov.github.io/public/Ape.json')
    const [apeRes, dbRes] = await Promise.all([
        fetch('https://dai-martov.github.io/public/Ape.json'),
        fetch('https://dai-martov.github.io/public/db2.json')
      ]);
    let ape = await apeRes.json()
    let db = await dbRes.json()
    
    getBalance(ape)
    getNFTs(ape, db)
    
    //return [ape, db]
}

getRes()
