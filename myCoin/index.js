const sha256 = require('crypto-js/sha256');
class Block{
    constructor(timestamp,transaction,previousHash = ""){
        this.timestamp = timestamp;
        this.transaction = transaction;
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
             JSON.stringify(this.transaction) + 
             this.nonce +
             this.previousHash
             ).toString();
    }

}

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.generateGenesisBlock()];
       // this.chain.push();
       this.difficulty = 4;
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
        newBlock.mineBlock(this.difficulty);
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

const block2 = new Block("2021-06-22", {amount: 5});
myCoin.addBlock(block2);


console.log(myCoin); // return false;