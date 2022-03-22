
const hre = require("hardhat");


const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);
     
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
   
    let waveTxn = await waveContract.wave("A message!");
    await waveTxn.wait(); // Wait for the transaction to be mined
  
    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait(); // Wait for the transaction to be mined
  
    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
  };
    


const runMain = async () => {
    try {
          await main();
          process.exit(0)          
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}


runMain();