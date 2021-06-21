const sha256 = require('crypto-js/sha256');
class Block{
    constructor(timestamp,data,previousHash = ""){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha256(this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.generateGenesisBlock()];
       // this.chain.push();
    }

    generateGenesisBlock(){
        return new Block("2021-06-21","GENESIS","0000");
    }
    getLatestBlock(){
        let lengthOfChain = this.chain.length;
        // Return Last element of chain
        return this.chain[lengthOfChain-1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

const myCoin = new Blockchain();
const block = new Block("2021-06-22", {amount: 5});



myCoin.addBlock(block);

console.log(myCoin);