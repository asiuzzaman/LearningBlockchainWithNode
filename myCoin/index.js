const sha256 = require('crypto-js/sha256');
class Block{
    constructor(timestamp,data,previousHash = ""){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    mineBlock(difficulty){

        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0") ){

            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Mining Done: "+this.hash);
    }
    calculateHash(){
        return sha256(
            this.timestamp +
             JSON.stringify(this.data) + 
             this.nonce +
             this.previousHash
             ).toString();
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

    isBlockchainValid(){

        for(let i = 1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }
}

const myCoin = new Blockchain();
const block = new Block("2021-06-22", {amount: 5});



myCoin.addBlock(block);
console.log(myCoin.isBlockchainValid());  // return true
myCoin.chain[1].data = "Chain is being Hacked"

console.log(myCoin.isBlockchainValid()); // return false;