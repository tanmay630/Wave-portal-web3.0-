
import './App.css';
import { ethers } from "ethers";
import React,{ useState, useEffect } from "react";

import abi from './utils/WavePortal.json';


const App = () => {

  
   const contractAddress = "0x79e54B628CCCe21C715AdDf64e880cf72E98e84B";
   const contractABI = abi.abi;
   const [currentAccount, setCurrentAccount] =  useState('');
   const [message, setMessage] = useState('');
   const [allWaves, setAllWaves] = useState([]);
   const [loading, setLoading] = useState(false);
   const [getwaves, setwaves] = useState(false);
  

const checkIfWalletIsConnected = async () => {

    try {
     const { ethereum } = window;

     if (!ethereum) {
       console.log("Make sure you have metamask!");
    } else {
        console.log("We have the ethereum object", ethereum);    
    }
  const accounts = await ethereum.request({ method: "eth_accounts" });

  if (accounts.length !== 0) {
    const account = accounts[0];
    console.log("found an authorized account", account);
    setCurrentAccount(account);
    getAllWaves();
  } else {
    console.log("no authorised account found");
  }
     
} catch (error) {
  console.log(error);
}

}

const connectWallet = async () => {
  try {
    const {ethereum} = window;
    if(!ethereum) {
      alert("Get metamask");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected", accounts[0]);
    setCurrentAccount(accounts[0]);

  } catch (error) {
    console.log(error);
  }
}


useEffect(() => {
  checkIfWalletIsConnected();
}, [])



   const rendernotConnedtedContainer = () => (
    <button className='connect-button' onClick={connectWallet}>Connect Wallet</button>
   );

    
  const wave = async () => {
  
    try {
          const { ethereum }  = window;
          if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
            let count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count", count.toNumber());

            const waveTxn  = await wavePortalContract.wave(message, {gasLimit: 300000});
            console.log("Mining...", waveTxn.hash);
            setLoading(true);

            await waveTxn.wait();
            console.log("Mined -- ", waveTxn.hash);
    
            count = await wavePortalContract.getTotalWaves();
            console.log("Retrieved total wave count...", count.toNumber());
            setMessage(" ");
            setLoading(false);
          
          } else {
            console.log("ethereum object doesnt exist");
          }

    } catch (error) {
      console.log(error);
    }
  }  


     const getAllWaves = async () => {

        try {
              const {ethereum} = window;
               if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      
                const waves = await wavePortalContract.getAllWaves();

                let wavesCleaned = [];
                waves.forEach(wave => {
                  wavesCleaned.push({
                    address: wave.waver,
                    timestamp: new Date(wave.timestamp * 1000),
                    message: wave.message
                  });
                });

                setAllWaves(wavesCleaned);
        
               } else {
                 console.log("ethereum object doesn't exist")
               }
             } catch (error) {
               console.log(error);
             }
           };

           useEffect(() => {
             let wavePortalContract;

             const onNewWave = (from, timestamp, message) => {
               console.log("NewWave", from, timestamp, message);
               setAllWaves(prevState => [
                 ...prevState,
                 {
                   address: from,
                   timestamp: new Date(timestamp * 1000),
                   message: message,
                 },
               ]);
             };

             if (window.ethereum) {
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();
          
              wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
              wavePortalContract.on("NewWave", onNewWave);
            }
          
              return () => {
                if (wavePortalContract) {
                  wavePortalContract.off("NewWave", onNewWave);
                }
              }

           }, []);
     
 

  return (
    <div className="App-container">
       <header className='sitelogo'>
        <h1 className='text'>Tanmay 👋</h1>
              
             <div className="add-container"> 
           {currentAccount ? <p> Wallet: {currentAccount.slice(0,6)}...{currentAccount.slice(-4)}</p> : rendernotConnedtedContainer()}
           </div>
       </header>
       <div className='content-container bg-blur'>
         <div className='content'>
            <h2>👋 Hey Tanmay here</h2>  
               <p>I am Tanmay , i am a full stack web developer, and also i make ios/andriod apps, and currently learning web3.0 ,i you like what i do then wave at me</p>
                <textarea id="w3review" name="text" rows="10" cols="50" className='text-container' onChange={(e) => setMessage(e.target.value)}>
                    {message}     
                  </textarea>
          </div>
             <button className='btn btn-gradient' onClick={wave}>Wave</button>
                             
       </div>
       {loading ?  <div class="loader"></div> : <p></p>}           
       {allWaves.map((wave, index) => {
         return (
           <div key={index} className="message-container">
             <div>Address: {wave.address}</div>   
             <div>Time: {wave.timestamp.toString()}</div> 
             <div>Message:{wave.message}</div> 
           </div>
         )
       })}
    </div>
  );
};

export default App
