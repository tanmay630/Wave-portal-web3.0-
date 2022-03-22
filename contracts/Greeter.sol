//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);
    

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;


    constructor() {
        console.log("Yo yo, I am a contract and i am brilliant");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);

    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

   function getTotalWaves() public view returns (uint256) {
       console.log("we have %d total waves!", totalWaves);
       return totalWaves;
   }

}